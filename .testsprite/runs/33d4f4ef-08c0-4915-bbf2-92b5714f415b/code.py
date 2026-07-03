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
        
        # -> Open the game with URL parameter '?fresh=1' to start a new save and load the HUD showing 'GOLD'.
        await page.goto("https://merge-mage.vercel.app/?fresh=1")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'SUMMON L1 27' button to arm the first spellbook
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button to summon a second Lv1 book and auto-equip it into the next empty slot.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify two books with Lv1 badges are now visible in the equip slots (the page contains two 'Lv1' badges)
        # Assert: First equip slot displays a 'Lv1' badge.
        await expect(page.locator("xpath=/html/body/div[1]/main/div[2]/div[1]/div[1]/section/div[1]/div[1]").nth(0)).to_contain_text("Lv1", timeout=15000), "First equip slot displays a 'Lv1' badge."
        # Assert: Second equip slot displays a 'Lv1' badge.
        await expect(page.locator("xpath=/html/body/div[1]/main/div[2]/div[1]/div[1]/section/div[1]/div[2]").nth(0)).to_contain_text("Lv1", timeout=15000), "Second equip slot displays a 'Lv1' badge."
        current_url = await page.evaluate("() => window.location.href")
        # Assert: page loaded with a URL (final outcome verified by the AI judge during the run)
        assert current_url, 'Page should have loaded with a URL'
        current_url = await page.evaluate("() => window.location.href")
        # Assert: page loaded with a URL (final outcome verified by the AI judge during the run)
        assert current_url, 'Page should have loaded with a URL'
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    