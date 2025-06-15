import { rest, setupWorker } from 'msw';

export const handlers = [
  rest.get('/vans', (_req, res, ctx) =>
    res(
      ctx.json([
        { id: '1', name: 'Camper Deluxe' },
        { id: '2', name: 'Road Explorer' },
      ]),
    ),
  ),
];

export const worker = setupWorker(...handlers);
