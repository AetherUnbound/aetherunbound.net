/** @typedef {import("@octokit/types").Endpoints["GET /users/{username}/events/public"]['response']['data']} ActivityResponse */
/** @typedef {ActivityResponse[number]} Event */
/** @typedef {Event['repo']} Repo */

/**
 *
 * @param {string} id
 * @returns {HTMLElement}
 */
const assertElement = (id) => {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error("Missing required element.");
  }

  return el;
};

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
  "IssueCommentEvent",
  "IssuesEvent",
  "PullRequestEvent",
  "PullRequestReviewEvent",
  "PullRequestReviewCommentEvent",
  "PushEvent",
  "ReleaseEvent",
];

const SHOWN_REPOS = 3;
const SHOWN_EVENTS = 15;

const events = (await fetchEvents()).filter((event) =>
  EVENT_TYPES.includes(event.type || "")
);

const repos = Object.entries(
  events.reduce(
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
  )
)
  .filter(([k, v]) => v.length >= 2)
  .map(
    /**
     *
     * @param {[string, Event[]]} _
     * @returns {[string, Event[]]}
     */
    ([k, v]) => [k, v.slice(0, SHOWN_EVENTS)]
  )
  .slice(0, SHOWN_REPOS);

const $activityGroups = assertElement("activity-groups");

console.log(repos);

repos.forEach(([name, entries]) => {
  const $activity = document.createElement("div");
  $activity.setAttribute("class", "activity-group");

  const $header = document.createElement("h1");
  $header.innerText = name;
  $activity.append($header);

  entries.forEach((entry) => {
    const $entry = document.createElement("div");
    $entry.append(
      (() => {
        const $event = document.createElement("p");
        $event.innerText = entry.type || "";

        return $event;
      })()
    );

    $activity.append($entry);
  });

  $activityGroups.append($activity);
});
