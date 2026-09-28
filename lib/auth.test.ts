import assert from "node:assert/strict";
import { agentValid } from "./auth";

delete process.env.AGENT_TOKEN;
assert.ok(!agentValid("Bearer x"), "fails closed");
process.env.AGENT_TOKEN = "tok";
assert.ok(agentValid("Bearer tok"));
assert.ok(!agentValid("Bearer to"));
assert.ok(!agentValid(null));
console.log("auth ok");
