import test from "node:test";
import assert from "node:assert/strict";

import { isStrictBestCodingCandidate } from "../../open-sse/services/autoCombo/taskFitness.ts";
import { mapIntentToTaskType } from "../../open-sse/services/combo/autoStrategy.ts";
import { resolveBuiltinAutoSpec } from "../../open-sse/services/autoCombo/builtinCatalog.ts";

test("auto/best-coding builtin spec is strict coding", () => {
  assert.deepEqual(resolveBuiltinAutoSpec("auto/best-coding", "best-coding"), {
    variant: "coding",
    strictTask: "coding",
  });
});

test("strict best-coding keeps explicit coding identities and curated coding evidence", () => {
  assert.equal(isStrictBestCodingCandidate("codex", "gpt-5.6-sol"), true);
  assert.equal(isStrictBestCodingCandidate("gemini", "gemini-2.5-flash"), true);
  assert.equal(isStrictBestCodingCandidate("openrouter", "openai/o4-mini-high"), true);
});

test("strict best-coding rejects generic/community/domain models without coding evidence", () => {
  for (const model of [
    "big-pickle",
    "ling-3.0-flash-fin-free",
    "muse-spark-1.3-contributor-free",
    "nemotron-3.5-lightning-free",
  ]) {
    assert.equal(isStrictBestCodingCandidate("opencode", model), false, model);
  }
});

test("best-coding task override wins over non-code prompt intent", () => {
  assert.equal(mapIntentToTaskType("simple", "coding"), "coding");
  assert.equal(mapIntentToTaskType("medium", "coding"), "coding");
  assert.equal(mapIntentToTaskType("reasoning", "coding"), "coding");
});
