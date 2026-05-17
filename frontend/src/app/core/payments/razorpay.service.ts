import { Injectable, inject } from '@angular/core';
import { Observable, fromEvent, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

declare const Razorpay: new (options: RazorpayOptions) => RazorpayInstance;

interface RazorpayOptions {
    key: string;
    order_id: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    handler: (response: { razorpay_payment_id: string }) => void;
    modal: { ondismiss: () => void };
    prefill?: Record<string, string>;
}

interface RazorpayInstance {
    open(): void;
    close(): void;
}

@Injectable({ providedIn: 'root' })
export class RazorpayService {
    private scriptLoaded = false;

    /** Dynamically loads Razorpay script on first call, then opens checkout. */
    openCheckout(orderId: string, amount: number): Observable<string> {
        return new Observable((observer) => {
            this.loadScript().then(() => {
                const rzp = new Razorpay({
                    key: '', // Injected by backend order; key comes from order config
                    order_id: orderId,
                    amount,
                    currency: 'INR',
                    name: 'PPH Society',
                    description: 'Payment',
                    handler: (response) => {
                        observer.next(response.razorpay_payment_id);
                        observer.complete();
                    },
                    modal: {
                        ondismiss: () => {
                            observer.error(new Error('Payment dismissed by user'));
                        },
                    },
                });
                rzp.open();
            });
        });
    }

    private loadScript(): Promise<void> {
        if (this.scriptLoaded || typeof window === 'undefined') {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                this.scriptLoaded = true;
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Razorpay script'));
            document.head.appendChild(script);
        });
    }
}
