import express from 'express';

// Routers
import { userRouter } from './user/user-router';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use('/api/user', userRouter);

// eslint-disable-next-line no-undef
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
