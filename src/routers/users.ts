import express, { Request, Response } from 'express';
import { postSchema, putSchema, limitSchema } from './schemas/users/request';
import { createValidator } from 'express-joi-validation';
import handleError from './handlers/error';
import { create, getById, limit, remove, update } from './handlers/users';

const router = express.Router();
const validator = createValidator();

router.get('/:id', handleError(getById));

router.get('/autoSuggest/:login', validator.query(limitSchema), handleError(limit));

router.post('/', validator.body(postSchema), handleError(create));

router.put('/:id', validator.body(putSchema), handleError(update));

router.delete('/:id', handleError(remove));

export default router;