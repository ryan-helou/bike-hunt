import assert from "node:assert/strict";
import { agentValid, passcodeValid, sessionToken, sessionValid } from "./auth";

delete process.env.APP_PASSCODE;
delete process.env.AGENT_TOKEN;
assert.equal(sessionToken(), null, "no passcode, no session");
assert.ok(!passcodeValid(""), "fails closed");
assert.ok(!agentValid("Bearer x"), "fails closed");

process.env.APP_PASSCODE = "wheel";
process.env.AGENT_TOKEN = "tok";
assert.ok(passcodeValid("wheel"));
assert.ok(!passcodeValid("whee"));
assert.ok(sessionValid(sessionToken()!));
assert.ok(!sessionValid("forged"));
assert.ok(agentValid("Bearer tok"));
assert.ok(!agentValid("Bearer to"));
assert.ok(!agentValid(null));
console.log("auth ok");
