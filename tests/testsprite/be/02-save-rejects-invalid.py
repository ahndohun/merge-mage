import os
import json
import requests
TARGET_URL = os.environ.get("TARGET_URL", "https://merge-mage.vercel.app")
STATE = json.loads('''{"gold":500,"books":[{"id":"b1","level":3,"element":"fire"}],"equipped":[null,null,null,null,null,null],"highestLevelEver":3,"stage":4,"wave":1,"stageHp":96,"wizardLevel":1,"wizardXp":0,"skillPoints":0,"skills":{"summonBonus":0,"castSpeed":0,"goldGain":0,"critChance":0},"manaCrystals":0,"prestigeCount":0,"lastSeenServerTs":null,"slotTiers":[0,0,0,0,0,0],"castProgressMs":[0,0,0,0,0,0],"enemiesHp":[19.2,19.2,19.2,19.2,19.2],"bossElapsedMs":0,"frostSlowMs":0,"recentGoldPerSecond":0,"elapsedMs":0,"rngSeed":42,"rngState":42,"nextBookId":1}''')
def test_rejects_negative_gold():
    bad = dict(STATE); bad["gold"] = -5
    r = requests.post(f"{TARGET_URL}/api/save", json={"token":"e2e_test_token_0123456789abcdefgh","state":bad})
    assert r.status_code == 400, r.text
def test_rejects_absurd_stage():
    bad = dict(STATE); bad["stage"] = 999999
    r = requests.post(f"{TARGET_URL}/api/save", json={"token":"e2e_test_token_0123456789abcdefgh","state":bad})
    assert r.status_code == 400, r.text
def test_rejects_short_token():
    r = requests.post(f"{TARGET_URL}/api/save", json={"token":"short","state":STATE})
    assert r.status_code == 400, r.text
test_rejects_negative_gold(); test_rejects_absurd_stage(); test_rejects_short_token()
