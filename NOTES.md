# FE-05 — shadcn/ui Comparison Notes

## Purpose

For FE-05, I first built the Disclosure, Tabs, and Modal Dialog
components manually using React and TypeScript.

After that, I installed shadcn/ui and added its Dialog and Tabs
components. I read the generated source code to compare its approach
with my handwritten implementations.

The main question was:

> What did shadcn/Base UI handle that I had to implement manually?

---

## 1. Tabs — Keyboard Navigation and Focus Management

### My implementation

In my handwritten Tabs component, I manually handled keyboard
navigation.

For example, I listened for:

```tsx
event.key === "ArrowRight"
```

and:

```tsx
event.key === "ArrowLeft"
```

I then calculated the next/previous tab and manually moved focus using
a React ref:

```tsx
tabsRef.current[nextIndex]?.focus();
```

I therefore had to manage:

* ArrowRight navigation
* ArrowLeft navigation
* Moving focus between tabs
* Keeping the active tab synchronized with focus
* Tab indexes

### shadcn/Base UI

The generated `tabs.tsx` uses:

```tsx
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
```

and `TabsTrigger` is built on:

```tsx
<TabsPrimitive.Tab />
```

The generated wrapper does not contain my manual `onKeyDown`,
arrow-key handling, or `useRef` focus-management code.

The underlying Base UI Tabs primitive handles the tab interaction
behavior.

### What I missed

I had to manually implement keyboard and focus behavior that the
underlying accessible Tabs primitive already provides.

---

## 2. Tabs — Accessibility State and Relationships

### My implementation

I manually added accessibility attributes such as:

```tsx
role="tab"
aria-selected={activeTab === "react"}
```

and had to manage the relationship between the selected tab and its
content myself.

### shadcn/Base UI

The generated component uses Base UI primitives such as:

```tsx
<TabsPrimitive.Tab />
```

and:

```tsx
<TabsPrimitive.Panel />
```

The primitive manages the tab semantics, state, and relationships
instead of requiring me to manually implement the complete interaction
pattern.

### What I missed

My implementation required me to manually manage more of the ARIA
state and tab-panel behavior, while the accessible primitive
encapsulates this behavior.

---

## 3. Dialog — Focus Trapping

### My implementation

For my handwritten Modal Dialog, I had to manually implement focus
management.

I needed to:

* Move focus into the dialog when it opens
* Detect focusable elements
* Handle `Tab`
* Handle `Shift + Tab`
* Prevent focus from escaping the dialog
* Wrap focus from the last element back to the first

### shadcn/Base UI

The generated `dialog.tsx` is built around:

```tsx
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
```

and uses primitives such as:

```tsx
<DialogPrimitive.Root />
<DialogPrimitive.Popup />
<DialogPrimitive.Close />
```

The generated wrapper does not contain my manual focus-trapping
implementation.

The underlying Dialog primitive handles the complex dialog interaction
and focus behavior.

### What I missed

I had to implement focus trapping myself, while the accessible Dialog
primitive encapsulates this behavior.

---

## 4. Dialog — Focus Restoration

### My implementation

I had to explicitly remember the element that opened the modal and
return focus to it after the dialog closed.

This required React refs and explicit focus management.

### shadcn/Base UI

The generated Dialog is based on the Base UI Dialog primitive, which
handles the dialog lifecycle and focus behavior.

### What I missed

Focus restoration is easy to overlook when implementing a modal from
scratch. An accessible dialog primitive handles this as part of its
interaction model.

---

## 5. Component Reusability

### My implementation

My Tabs component was created specifically for the assignment's
example tabs:

```text
React
Vue
Angular
```

The implementation contained the tab values and navigation logic
directly in the component.

### shadcn

The generated code separates the Tabs API into reusable components:

```text
Tabs
TabsList
TabsTrigger
TabsContent
```

The actual tab values and content are provided by the component user.

### What I missed

My implementation was more tightly coupled to one example, while the
shadcn/Base UI approach provides reusable primitives that can be used
for many different tab interfaces.

---

# Summary

The biggest differences I found were:

1. **Keyboard and focus management:** I manually implemented arrow-key
   navigation and focus movement for Tabs, while the underlying Base UI
   primitive handles it.

2. **Modal focus management:** I manually implemented focus trapping
   and focus restoration for the Dialog, while the underlying Dialog
   primitive handles these behaviors.

3. **Accessibility state and relationships:** I manually managed more
   of the ARIA state and relationships, while the primitives encapsulate
   the accessibility behavior.

4. **Reusability:** My handwritten components were designed around the
   assignment examples, while shadcn provides reusable primitives such
   as `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`.

## Main Lesson

Building the components manually first helped me understand what is
actually required to make interactive components accessible.

After comparing them with shadcn/Base UI, I can now recognize that an
accessible component library is not just providing styling. It can
also encapsulate difficult keyboard, focus, state, and accessibility
behavior.

This is why understanding the underlying accessibility patterns is
important before relying on AI-generated or library-generated
components.
