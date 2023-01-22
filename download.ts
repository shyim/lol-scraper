const APIKEY = Deno.args[0] || '';

if (APIKEY === '') {
    console.error('Cannot find api key');
    Deno.exit(1);
}

import {existsSync} from "https://deno.land/std/fs/mod.ts";
import { sleep } from "https://deno.land/x/sleep/mod.ts";

async function main() {
    const gameids = await(await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/nor02xlFnxQbf-rUDK9ElPt8rZBLX2027oxC66JkoyDK74pJA9TArWrY66jrQtaYxMiaZwpDinv78g/ids?start=0&count=100&api_key=${APIKEY}`)).json();

    for (let gameId of gameids) {
        if (existsSync(`games/${gameId}.json`)) {
            continue;
        }

        console.log(`Downloading gamedata: ${gameId}`);

        const req = await fetch(
            `https://europe.api.riotgames.com/lol/match/v5/matches/${gameId}?api_key=${APIKEY}`,
          );

        if (req.status === 429) {
            console.log('Rate limited');
            await sleep(120);
            continue;
        }

        const api = await req.json();
      
        await Deno.writeTextFileSync(`games/${gameId}.json`, JSON.stringify(api));
    }
}

await main();
