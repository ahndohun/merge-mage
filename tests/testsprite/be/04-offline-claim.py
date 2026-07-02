import os
import json
import requests
TARGET_URL = os.environ.get("TARGET_URL", "https://merge-mage.vercel.app")
STATE = json.loads('''{"gold":500,"books":[{"id":"b1","level":3,"element":"fire"}],"equipped":[null,null,null,null,null,null],"highestLevelEver":3,"stage":4,"wave":1,"stageHp":96,"wizardLevel":1,"wizardXp":0,"skillPoints":0,"skills":{"summonBonus":0,"castSpeed":0,"goldGain":0,"critChance":0},"manaCrystals":0,"prestigeCount":0,"lastSeenServerTs":null,"slotTiers":[0,0,0,0,0,0],"castProgressMs":[0,0,0,0,0,0],"enemiesHp":[19.2,19.2,19.2,19.2,19.2],"bossElapsedMs":0,"frostSlowMs":0,"recentGoldPerSecond":0,"elapsedMs":0,"rngSeed":42,"rngState":42,"nextBookId":1}''')
TOK = "e2e_test_token_0123456789abcdefgh"
def test_unknown_token_404():
    r = requests.post(f"{TARGET_URL}/api/offline-claim", json={"token":"unknown_token_0123456789abcdef"})
    assert r.status_code == 404, r.text
def test_claim_nonnegative():
    requests.post(f"{TARGET_URL}/api/save", json={"token": TOK, "state": STATE})
    r = requests.post(f"{TARGET_URL}/api/offline-claim", json={"token": TOK})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["gold"] >= 0 and body["cappedHours"] <= 8
test_unknown_token_404(); test_claim_nonnegative()
