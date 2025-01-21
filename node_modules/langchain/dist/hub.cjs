"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pull = exports.push = void 0;
const langsmith_1 = require("langsmith");
const index_js_1 = require("./load/index.cjs");
/**
 * Push a prompt to the hub.
 * If the specified repo doesn't already exist, it will be created.
 * @param repoFullName The full name of the repo.
 * @param runnable The prompt to push.
 * @param options
 * @returns The URL of the newly pushed prompt in the hub.
 */
async function push(repoFullName, runnable, options) {
    const client = new langsmith_1.Client(options);
    const payloadOptions = {
        object: runnable,
        parentCommitHash: options?.parentCommitHash,
        isPublic: options?.isPublic ?? options?.newRepoIsPublic,
        description: options?.description ?? options?.newRepoDescription,
        readme: options?.readme,
        tags: options?.tags,
    };
    return client.pushPrompt(repoFullName, payloadOptions);
}
exports.push = push;
/**
 * Pull a prompt from the hub.
 * @param ownerRepoCommit The name of the repo containing the prompt, as well as an optional commit hash separated by a slash.
 * @param options
 * @returns
 */
async function pull(ownerRepoCommit, options) {
    const client = new langsmith_1.Client(options);
    const promptObject = await client.pullPromptCommit(ownerRepoCommit, {
        includeModel: options?.includeModel,
    });
    if (promptObject.manifest.kwargs?.metadata === undefined) {
        promptObject.manifest.kwargs = {
            ...promptObject.manifest.kwargs,
            metadata: {},
        };
    }
    promptObject.manifest.kwargs.metadata = {
        ...promptObject.manifest.kwargs.metadata,
        lc_hub_owner: promptObject.owner,
        lc_hub_repo: promptObject.repo,
        lc_hub_commit_hash: promptObject.commit_hash,
    };
    return (0, index_js_1.load)(JSON.stringify(promptObject.manifest));
}
exports.pull = pull;
