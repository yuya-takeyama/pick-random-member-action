<p align="center">
  <a href="https://github.com/yuya-takeyama/pick-random-member-action"><img alt="pick-random-member-action status" src="https://github.com/yuya-takeyama/pick-random-member-action/workflows/build-test/badge.svg"></a>
</p>

# Pick random member

Pick a random member from a team in GitHub Issues/Pull Requests

## Usage

```yaml
on:
  workflow_run:
    workflows:
      - '**'
    types:
      - completed

jobs:
  actions-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: yuya-takeyama/github-actions-metrics-to-datadog-action@v0.2.1
        with:
          github-token: ${{ secrets.OWNER_GITHUB_TOKEN }}
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
          enable-workflow-metrics: 'true'
          enable-billing-metrics: 'true'
```

## Inputs

| Name                      | Required | Default | Description                         |
|---------------------------|----------|---------|-------------------------------------|
| `github-token`            | `false`  |         | GitHub API token                    |
| `datadog-api-key`         | `true`   |         | Datadog API key                     |
| `enable-workflow-metrics` | `true`   |         | Set "true" to send workflow metrics |
| `enable-billing-metrics`  | `true`   |         | Set "true" to send billing metrics  |

### Required scopes for `github-token`

It's required when `enable-billing-metrics` is true.

`secrets.GITHUB_TOKEN` doesn't work for it.

#### A repo belongs to a user

* `user`

Details: https://docs.github.com/en/rest/reference/billing#get-github-actions-billing-for-a-user

#### A repo belongs to an organization

* `repo`
* `admin:org`

Also, the token must be created by a user who has ownership for the organization.

Details: https://docs.github.com/en/rest/reference/billing#get-github-actions-billing-for-an-organization

## Metrics

### Workflow metrics

* `github.actions.workflow_duration`

### Billing metrics

* `github.actions.billing.total_minutes_used`
* `github.actions.billing.total_paid_minutes_used`
* `github.actions.billing.included_minutes`
* `github.actions.billing.minutes_used_breakdown`
