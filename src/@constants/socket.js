import {apiUrl} from '@constants';
import io from 'socket.io-client';

export const socket = io(`${apiUrl}/chatsocket`);
