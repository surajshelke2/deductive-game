# Shape Logic Grid (React/Next.js Game)

A fast, brain-teasing logic game where you deduce the missing shape in a partially filled grid. Each row and column must contain **unique** shapes. Beat the clock, score points, and advance through increasing grid sizes.

---

## 🧠 Aim

Build a timed puzzle game that strengthens pattern recognition and logical reasoning using unique-shape constraints on a grid.

## 🎯 Purpose

* Practice grid-constraint thinking (Latin-square style uniqueness).
* Train focus under time pressure (20s per attempt).
* Demonstrate clean React/Next.js architecture with well-structured state and utilities.

## ⚙️ Working (High-Level)

1. Pick a **section** (grid size 3×3 → 5×5). There are **3 sections** and **15 total attempts** (5 attempts per section).
2. For each attempt:

   * A grid is generated where each **row & column has unique shapes**.
   * A subset of cells is **revealed** based on the section rules (see table).
   * One target cell is marked with \`\`.
   * You get **multiple-choice options**; choose the correct shape before **20s** ends.
3. **Scoring**: Correct = **+1**. **Timeout = −1**. (Incorrect guess is configurable; default **0**.)
4. After 5 attempts in a section, move to the next grid size.

---

## 📏 Game Rules

| Shapes | Grid Size | Options Shown | On‑Grid Display (prefilled cells) |
| ------ | --------- | ------------- | --------------------------------- |
| 3      | 3 × 3     | 3             | 3                                 |
| 4      | 4 × 4     | 4             | 6                                 |
| 5      | 5 × 5     | 5             | 8                                 |

Additional rules:

* Every **row** and **column** must contain **unique** symbols.
* The \`\` cell must be deduced from row/col constraints.
* **Timer**: 20 seconds per attempt. Total attempts: **15** (5 per section).

---

## 🧩 Algorithms Used

* **Fisher–Yates Shuffle** — randomizes arrays (shapes, cell order, options).
* **Backtracking (DFS)** — constructs a valid grid ensuring row/column uniqueness.
* **Constraint Checking** — prevents duplicates per row/column during fill.
* **Random Sampling** — selects which cells to prefill; chooses the target `?` cell.
* **Multiple-Choice Generation** — picks 1 correct + (n−1) distractors, then shuffles.

> These choices ensure variety while guaranteeing solvable puzzles.

---

## 🛠️ Tech Stack

* **Next.js (App Router)** + **React** + **TypeScript**
* **Tailwind CSS** (+ optional **shadcn/ui** for UI components)
* **Zustand** or **Context** for game state (choose one)

> Works equally well in plain React + Vite; update scripts accordingly.

---

## 📦 Installation

```bash
# clone
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# install deps
pnpm install
# or: npm install / yarn install

# dev
pnpm dev
# builds at http://localhost:3000

# production build
pnpm build && pnpm start
```

---

## ▶️ How to Play

1. Press **Start**.
2. A partially filled grid appears with one \`\` cell.
3. Use the **row/col uniqueness** rule to deduce the missing shape.
4. Choose from the **options** before the **20s** timer ends.
5. Score updates instantly. **5 attempts** per section → then advance.

---
## 🧭 Game Flow

* **Sections**: 3 → 4 → 5 grid sizes; **5 attempts** each.
* **Timer**: 20s per attempt.
* **End Conditions**: finish all attempts; final score shown with breakdown.

---

## 🧮 Scoring

* **Correct within time**: **+1**
* **Timeout**: **−1**
* **Incorrect guess**: **0** (configurable; switch to −1 via a flag)
---

