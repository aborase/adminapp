import {ToastOptions} from 'ng2-toastr';

export class CustomOption extends ToastOptions {
        positionClass = 'toast-bottom-full-width';
        maxShown = 5;
        newestOnTop = false;
        animate = 'fade';
        // override-able properties
        toastLife = 2000;
        enableHTML = false;
        dismiss = 'auto'; //'auto' | 'click' | 'controlled'
        messageClass = 'toast-message';
        titleClass = 'toast-title';
        showCloseButton = false;
}