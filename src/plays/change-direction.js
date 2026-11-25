// Section 2, lesson 4. Drafted from standard fundamentals; review before removing status: 'draft'.
export default {
  id: 'change-direction',
  title: 'Changing direction',
  level: 'beginner',
  section: 'cutting',
  order: 4,
  status: 'draft',
  buildsOn: ['under-cut', 'deep-cut'],
  category: 'Offense',
  tags: ['cutting', 'plant', 'footwork'],
  summary: 'A sharp plant is what makes a cut work. Rounded cuts let the defender keep up.',
  view: [32, 66],
  overviewDefense: true,
  disc: 'H1',
  players: [
    { id: 'H1', team: 'O', label: 'H1', pos: [20, 62] },
    { id: 'C1', team: 'O', label: 'C1', pos: [24, 46] },
    { id: 'M', team: 'D', label: 'M', pos: [17.2, 59.4] },
    { id: 'D1', team: 'D', label: 'D', pos: [29.2, 48.6] },
  ],
  variants: [
    {
      id: 'sharp',
      label: 'Sharp plant',
      tone: 'good',
      outcome: 'Result: D is still moving the wrong way, so C1 is open.',
      steps: [
        {
          caption: 'C1 drives hard at D, selling a deep cut. D backs up quickly to stay with them.',
          focus: ['C1'],
          moves: [
            { id: 'C1', to: [24.6, 40.4], kind: 'cut' },
            { id: 'D1', to: [29.2, 37], kind: 'defense' },
          ],
        },
        {
          caption: 'C1 plants on the outside foot and changes direction sharply. D is still going the wrong way, so C1 has space, and H1 throws.',
          focus: ['C1'],
          moves: [
            { id: 'C1', to: [32, 52], kind: 'cut' },
            { id: 'D1', via: [[29.4, 35.4]], to: [29.6, 43], kind: 'defense' },
          ],
          throw: { from: 'H1', to: 'C1', kind: 'flick', at: 0.55 },
        },
      ],
    },
    {
      id: 'rounded',
      label: 'Rounded cut',
      tone: 'bad',
      outcome: 'Result: D stays with C1 the whole way, so there’s no throw.',
      steps: [
        {
          caption: 'C1 drifts deep without much intent. D backs up slowly, in no hurry.',
          focus: ['C1'],
          moves: [
            { id: 'C1', to: [24.6, 42], kind: 'jog' },
            { id: 'D1', to: [28.4, 44.2], kind: 'defense', start: 0.1 },
          ],
        },
        {
          caption: 'C1 curves around instead of planting. D just follows the curve and stays with them.',
          focus: ['D1'],
          moves: [
            { id: 'C1', via: [[25.6, 46.4], [28, 50]], to: [32, 52], kind: 'cut' },
            { id: 'D1', via: [[31, 46.4]], to: [35, 48.4], kind: 'defense' },
          ],
          lanes: [{ from: 'H1', to: 'C1', tone: 'blocked', at: 0.75, label: 'Covered' }],
        },
      ],
    },
  ],
  coaching: [
    'Sell the first direction hard, or the defender won’t bite.',
    'Plant on your outside foot and push off; the change of direction should be sharp.',
    'Accelerate out of the cut. That burst is what creates the space.',
  ],
  mistakes: ['Rounding off the cut, which lets the defender keep up.', 'Jogging the fake, so the defender doesn’t believe it.'],
};
