const puppeteer = require("puppeteer");

async function start() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    userDataDir: "./tmp",
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  // page.setRequestInterception(true);
  // page.on("request", (req) => {
  //   if (req.url().endsWith(".png")) {
  //     req.abort();
  //   } else {
  //     req.continue();
  //   }
  // });

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  });

  url = "https://shoob.gg/mini-games";

  await page.goto(url, { waitUntil: "load", timeout: 0 });

  await page.waitForTimeout("5000");

  const visited = new Map();
  while (true) {
    let timeout = getRandomInt(1000, 3000).toString();

    await page.waitForSelector(".gamebit button", { timeout: 0 });
    // const preview = await page.$$(".gamebit .ewvPPe");
    const preview = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(".gamebit .text-center a[href]"),
        (a) => "https://shoob.gg" + a.getAttribute("href")
      )
    );
    // console.log(preview)
    const arr = preview.reverse();
    for (let k = 0; k < arr.length; k++) {
      if (visited.has(arr[k])) continue;
      else visited.set(arr[k], false);
    }

    for (let i = 0; i < arr.length; i++) {
      try {
        if (!visited.get(arr[i])) {
          await page.goto(arr[i]);
          visited.set(arr[i], true);
        } else {
          continue;
        }
        await page.waitForTimeout(1000);
      } catch (error) {
        continue;
      }
      console.log(visited);

      try {
        await page.waitForSelector(".minigameimg", {
          timeout: 3000,
          delay: 200,
        });
        //clicks on first image
        const cards = await page.$$(".minigameimg");
        await cards[3].click();
        for (let j = 0; j < cards.length; j++) {
          await cards[j].click();
          await page.waitForTimeout(300);
        }
        // await page.click(".cardgamecont .minigameimg",{timeout:0});
        await page.waitForTimeout(timeout); //timeout
        await page.goBack({ timeout: 0 }); //goes back
      } catch (error) {
        await page.goBack({ timeout: 0 });
        await page.reload();
      }
      await page.waitForTimeout(timeout); //timeout
      setInterval(() => {
        visited.clear();
      }, 600000);
    }
  }
  //await browser.close()
}

// async function firstclick(page) {
//   //wait till load
//   await page.waitForSelector(".gamebit button", { timeout: 0 });
//   //get element array
//   // const preview = await page.$x(
//   //   '//*[@id="root"]/div/div[3]/div[5]/div[8]/div/div/div/a/button'
//   // );
//   const preview = await page.$$(".gamebit .ewvPPe");
//   await preview[preview.length - 1].click();
// }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

start();
