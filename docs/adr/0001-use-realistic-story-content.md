# 0001: Use realistic content in stories

- **Date**: 2026-02-16
- **Status**: Accepted
- **Reviewers**: Design Systems, Content Design, Frontend Guild

## Context

Our stories and examples often rely on placeholder copy like “Section 1 title” or “Lorem ipsum”. When the UI’s clarity depends on semantic cues (for example, numbered steps vs. unordered tabs), meta or generic text hides usability gaps and makes it harder to judge whether the component communicates its purpose. Recent design reviews (see issue discussion on “generic meta text”) highlighted that sequence-dependent patterns only felt clear because the word “Step” appeared in the placeholder copy.

## Decision

We will default to using realistic, task-like copy in stories, documentation examples, and visual regression fixtures. Placeholder or meta descriptors (e.g., “Section 1” or “Lorem ipsum”) should be replaced with representative labels and short, believable body text that exercise the intended semantics of the component.

When a pattern depends on ordered meaning, examples should include the affordance directly in the design (e.g., prepend step numbers in the component or story) rather than relying on meta copy to communicate order.

## Consequences

- Storybook consumers can better evaluate clarity, affordances, and accessibility because the examples resemble real tasks.
- Visual and regression tests will be less brittle to copy changes while still validating the intended semantics.
- Designers and engineers get faster feedback on whether a component communicates sequence, hierarchy, or action without extra labels.
- Extra up-front effort is required to craft purposeful example copy when adding or updating stories.

## Implementation Notes

- Update existing stories incrementally, starting with Accordion (React and Web Components) to replace placeholder titles and lorem ipsum with realistic scenarios.
- New stories should choose a concise, domain-neutral scenario (e.g., checkout, profile setup, permissions) with purposeful headings and body text.
- If ordered meaning is important, encode it in the component or story (e.g., “1. Select colour”) instead of assuming placeholder labels will be present.
