import {test,expect} from '@playwright/test';

test('fresh browsers use automatic server sessions and native Aura without a code',async({page})=>{
 await page.route('**/api/status',r=>r.fulfill({json:{aiConfigured:true,automaticSession:true,sources:[]}}));
 let cookieSent=false;
 await page.route('**/api/assist',async r=>{cookieSent=!!r.request().headers().cookie?.includes('lexradar_session=');await r.fulfill({json:{text:'# An integrated Aura draft\n\nAn argument with a source [reference](https://example.org/paper).',references:[{title:'Original paper',url:'https://example.org/paper'}]}});});
 await page.goto('/');await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'AuraPraxis',exact:true}).click();
 await page.getByLabel('Working title',{exact:true}).fill('Native writing project');await page.getByRole('button',{name:'Start in AuraPraxis',exact:false}).click();
 await expect(page.getByRole('button',{name:'Run task',exact:true})).toBeEnabled();await expect(page.getByLabel('Workspace access code')).toHaveCount(0);
 await page.getByRole('button',{name:'Run task',exact:true}).click();await expect(page.locator('.citation-card')).toHaveCount(1);expect(cookieSent).toBe(true);
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export to Zotero / RIS'}).click();expect((await download).suggestedFilename()).toMatch(/\.ris$/);
 await page.getByRole('button',{name:'Use as working draft & save version',exact:true}).click();await expect(page.getByLabel('Aura working document')).toHaveValue(/integrated Aura draft/);
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Tools',exact:true}).click();await page.getByRole('button',{name:'Undetectable AI',exact:true}).click();await expect(page.getByRole('link',{name:'Open Undetectable AI',exact:true})).toHaveAttribute('href','https://undetectable.ai/');await page.getByRole('button',{name:'Zotero Web',exact:true}).click();await expect(page.getByRole('heading',{name:'Zotero library reader'})).toBeVisible();
});

test('profile defaults persist and evidence summaries use supplied abstracts',async({page})=>{
 await page.route('**/api/status',r=>r.fulfill({json:{aiConfigured:true,automaticSession:true,sources:[]}}));
 await page.route('**/api/scholarly?*',r=>r.fulfill({json:{provider:'OpenAlex',fetchedAt:'2026-11-01T10:00:00Z',works:[{id:'W1',title:'Evidence on access',url:'https://example.org/evidence',authors:['Research Author'],year:2025,venue:'Research Journal',citations:5,references:[],provider:'OpenAlex',abstract:'A study of access to justice using a survey.',isOpenAccess:true}],edges:[]}}));
 let submitted='';await page.route('**/api/assist',async r=>{submitted=r.request().postDataJSON().text;await r.fulfill({json:{text:'The abstract describes a survey. Full text is needed to assess the findings.'}});});
 await page.goto('/');await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Profile',exact:true}).click();await page.getByLabel('Display name',{exact:true}).fill('Example researcher');await page.getByLabel('Default citation style').selectOption('OSCOLA');await page.getByRole('button',{name:'Save profile',exact:true}).click();await page.reload();await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Profile',exact:true}).click();await expect(page.getByLabel('Default citation style')).toHaveValue('OSCOLA');
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Literature',exact:true}).click();await page.getByLabel('Topic, title, or DOI').fill('Access to justice');await page.getByRole('button',{name:'Search papers',exact:true}).click();await expect(page.locator('.evidence-card-list')).toContainText('A study of access to justice');await page.getByRole('button',{name:'Summarize these papers',exact:true}).click();await expect(page.locator('.evidence-answer')).toContainText('Full text is needed');expect(submitted).toContain('A study of access to justice using a survey.');
});
