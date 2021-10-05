import { animate, state, style, transition, trigger } from "@angular/animations";

export const fade = trigger('fade', [


    transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease-in', style({ opacity: 0 }))
    ]),

    transition(':leave',
        [animate('0.2s 10ms ease-out', style({ opacity: 0 }))])
])
