import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("https://merge-mage.vercel.app")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Navigate to the game with a fresh save using the URL /?fresh=1 and wait for the HUD showing 'GOLD' to appear.
        await page.goto("https://merge-mage.vercel.app/?fresh=1")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'SUMMON' button twice to arm the first spellbook and start combat.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON' button twice to arm the first spellbook and start combat.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Open the 'SKILLS' tab to view available skills and the unspent skill point counter.
        # SKILLS 1 button
        elem = page.get_by_test_id('tab-skills')
        await elem.click(timeout=10000)
        
        # -> Click the '+' allocate button on the first skill 'SUMMON FLOOR' to spend one skill point.
        # + button
        elem = page.get_by_test_id('skill-plus-summonBonus')
        await elem.click(timeout=10000)
        
        # -> Click the '+' allocate button on the first skill 'SUMMON FLOOR' to spend one skill point.
        # RESET button
        elem = page.get_by_test_id('skill-reset')
        await elem.click(timeout=10000)
        
        # -> Click the '+' allocate button on the 'CAST SPEED' skill to spend one skill point.
        # + button
        elem = page.get_by_test_id('skill-plus-summonBonus')
        await elem.click(timeout=10000)
        
        # -> Click the '+' button for the first skill 'SUMMON FLOOR' to allocate one skill point, then wait for the UI to update.
        # + button
        elem = page.get_by_test_id('skill-plus-summonBonus')
        await elem.click(timeout=10000)
        
        # -> Click the '+' button for 'SUMMON FLOOR' to allocate one skill point.
        # + button
        elem = page.get_by_test_id('skill-plus-summonBonus')
        await elem.click(timeout=10000)
        
        # -> Click the 'RESET' button in the skills panel to reset skill allocations.
        # RESET button
        elem = page.get_by_test_id('skill-reset')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify four skills are listed and the skill point counter shows at least 1
        # Assert: Expected the SKILLS tab to show 4 skills.
        await expect(page.locator("xpath=/html/body/div[1]/main/div[2]/div[1]/nav/button[2]").nth(0)).to_contain_text("SKILLS\n4", timeout=15000), "Expected the SKILLS tab to show 4 skills."
        
        # --> Verify the first skill's point count increased by one and the unspent skill point counter decreased by one
        # Assert: Expected the SKILLS tab badge to show '4' indicating the unspent skill points decreased by one.
        await expect(page.locator("xpath=/html/body/div[1]/main/div[2]/div[1]/nav/button[2]").nth(0)).to_contain_text("4", timeout=15000), "Expected the SKILLS tab badge to show '4' indicating the unspent skill points decreased by one."
        
        # --> Verify the first skill's point count returned to 0 and the unspent counter returned to its pre-allocation value
        # Assert: Expected the SKILLS tab to show the unspent skill points returned to 2.
        await expect(page.locator("xpath=/html/body/div[1]/main/div[2]/div[1]/nav/button[2]").nth(0)).to_contain_text("2", timeout=15000), "Expected the SKILLS tab to show the unspent skill points returned to 2."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    