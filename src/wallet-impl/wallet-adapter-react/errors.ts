import { WalletError } from '../abstract-wallet';

export class WalletNotSelectedError extends WalletError {
    name = 'WalletNotSelectedError';
}
