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
        
        # -> Open the game with a fresh save by navigating to /?fresh=1 and wait until the HUD shows 'GOLD'.
        await page.goto("https://merge-mage.vercel.app/?fresh=1")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'SUMMON L1 27' button to summon a level-1 book.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to summon two LV 1 books, then tap the first inventory book and the second inventory book to attempt a merge.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to summon two LV 1 books, then tap the first inventory book and the second inventory book to attempt a merge.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to summon two LV 1 books, then tap the first inventory book and the second inventory book to attempt a merge.
        # Lv1 HOLY UP 50 (+15%) button
        elem = page.get_by_test_id('equip-slot-0')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to summon two LV 1 books, then tap the first inventory book and the second inventory book to attempt a merge.
        # + SLOT UP 50 (+15%) button
        elem = page.get_by_test_id('equip-slot-1')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to create two LV 1 books, then list inventory buttons so the Lv1 items' indexes can be identified.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to create two LV 1 books, then list inventory buttons so the Lv1 items' indexes can be identified.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Tap the first 'Lv1 HOLY' inventory book, wait for the UI to reflect selection, then tap the other 'Lv1 HOLY' book to attempt a merge.
        # Lv1 HOLY UP 50 (+15%) button
        elem = page.get_by_test_id('equip-slot-0')
        await elem.click(timeout=10000)
        
        # -> Tap the first 'Lv1 HOLY' inventory book, wait for the UI to reflect selection, then tap the other 'Lv1 HOLY' book to attempt a merge.
        # Lv1 HOLY UP 50 (+15%) button
        elem = page.get_by_test_id('equip-slot-3')
        await elem.click(timeout=10000)
        
        # -> Tap the 'Lv1 FIRE' book to select it, then wait for the UI to reflect the selection before attempting the second tap.
        # Lv1 FIRE UP 50 (+15%) button
        elem = page.get_by_test_id('equip-slot-2')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to create two additional level-1 books so a manual merge can be attempted.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to create two additional level-1 books so a manual merge can be attempted.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Tap the first 'Lv1' book, wait for selection to show, then tap another 'Lv1' book to attempt a merge
        # Lv1 HOLY UP 50 (+15%) button
        elem = page.get_by_test_id('equip-slot-0')
        await elem.click(timeout=10000)
        
        # -> Tap the first 'Lv1' book, wait for selection to show, then tap another 'Lv1' book to attempt a merge
        # Lv1 FIRE UP 50 (+15%) button
        elem = page.get_by_test_id('equip-slot-2')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to add two level-1 books to the inventory, then list inventory items to locate Lv1 book elements.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # -> Click the 'SUMMON L1 27' button twice to add two level-1 books to the inventory, then list inventory items to locate Lv1 book elements.
        # SUMMON L1 27 button
        elem = page.get_by_test_id('summon-btn')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify a single book labeled LV 2 now exists where the merge happened
        # Assert: The inventory slot where the merge happened now shows a Level 2 book.
        await expect(page.locator("xpath=/html/body/div/main/div[2]/div[1]/div[1]/section/div[1]/div[4]").nth(0)).to_have_text("Lv2\nHOLY\nUP 50 (+15%)", timeout=15000), "The inventory slot where the merge happened now shows a Level 2 book."
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
    