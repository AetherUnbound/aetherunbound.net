/** @typedef {import("@octokit/types").Endpoints["GET /users/{username}/events/public"]['response']['data']} ActivityResponse */
/** @typedef {ActivityResponse[number]} Event */
/** @typedef {Event['repo']} Repo */

/** @returns {Promise<ActivityResponse>} */
const fetchEvents = async () => {
  const resp = await fetch(
    "https://api.github.com/users/AetherUnbound/events/public?per_page=100"
  );
  if (!resp.ok) {
    throw new Error();
  }
  const events = await resp.json();

  return /** @type {ActivityResponse} */ (events);
};

const EVENT_TYPES = [
  "CreateEvent",
  "ForkEvent",
  "IssueCommentEvent",
  "IssuesEvent",
  "PullRequestEvent",
  "PullRequestReviewEvent",
  "PullRequestReviewCommentEvent",
  "PushEvent",
  "ReleaseEvent",
];

const events = (await fetchEvents()).filter((event) =>
  EVENT_TYPES.includes(event.type || "")
);
console.log(events);

const repos = events.reduce(
  /**
   *
   * @param {Record<string, Event[]>} acc
   * @param {Event} event
   */
  (acc, event) => {
    const repo = event.repo.name;
    if (!acc[repo]) {
      acc[repo] = [];
    }

    acc[repo].push(event);

    return acc;
  },
  {}
);

console.log(repos);
