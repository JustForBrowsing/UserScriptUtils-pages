// ==UserLibrary==
// @name        FloatingDialog
// @author      Me
// @version     0.1.0
// @description FloatingDialog (floating-dialog) custom element
// ==/UserLibrary=
const libId = "FloatingDialog";
console.log(`%c${libId}: loading...`, 'color:#4060FF;');

class FloatingDialog extends HTMLElement {
    static template = null;
    static observedAttributes = Array.from(["open", "center", "top", "left", "bottom", "right"]);
    static cssSize(value) { return typeof value == 'number' ? `${value}px` : value; }

    /**
     * Whether the dialog is opened.
     * @attr
       */
    get open ()      { return this.hasAttribute("open"); }
    set open (value) { value ? this.setAttribute("open", "") : this.removeAttribute("open"); }

    /**
     * Whether the dialog is centered on the page.
     * @attr
     */
    get center ()      { return this.hasAttribute("center"); }
    set center (value) { value ? this.setAttribute("center", "") : this.removeAttribute("center"); }

    get top ()      { return this.hasAttribute("top"); }
    set top (value) { this.setAttribute("top", FloatingDialog.cssSize(value)); }

    get left ()      { return this.hasAttribute("left"); }
    set left (value) { this.setAttribute("left", FloatingDialog.cssSize(value)); }

    get bottom ()      { return this.hasAttribute("bottom"); }
    set bottom (value) { this.setAttribute("bottom", FloatingDialog.cssSize(value)); }

    get right ()      { return this.hasAttribute("right"); }
    set right (value) { this.setAttribute("right", FloatingDialog.cssSize(value)); }

    result;                 // Result of the dialog

    $dialog;
    $backdrop;
    $scrollContainer        = document.documentElement;
    $previousActiveElement  = null;

    /**
     * Attaches the shadow root.
     */
    constructor () {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        shadow.appendChild(FloatingDialog.template.content.cloneNode(true));

        this.$dialog         = shadow.querySelector("#dialog");
        this.$backdrop       = shadow.querySelector("#backdrop");

        this.onBackdropClick = this.onBackdropClick.bind(this);
        this.onKeyDown       = this.onKeyDown.bind(this);
        //this.onTouchEnd      = this.onTouchEnd.bind(this);

        // Set aria attributes
        this.setAttribute("aria-modal", "true");
        this.$dialog.setAttribute("role", "alertdialog");
    }

    // var rs = getComputedStyle(this.$dialog);
    // alert("The value of --dialog-padding is: " + rs.getPropertyValue('--dialog-padding'));

    // this.$dialog.style.setProperty('--dialog-padding', '100px');

    /**
     * Attaches event listeners when connected.
     */
    connectedCallback () {
        this.$backdrop.addEventListener("click",    this.onBackdropClick);
        this.$backdrop.addEventListener("touchend", this.onBackdropClick);
    }

    /**
     * Removes event listeners when disconnected.
     */
    disconnectedCallback () {
        this.$backdrop.removeEventListener("click",    this.onBackdropClick);
        this.$backdrop.removeEventListener("touchend", this.onBackdropClick);

        // If the dialog is open when it is removed from the DOM
        // we need to cleanup the event listeners and side effects.
        if (this.open) {
            this.didClose();
        }
    }

    /**
     * Shows the dialog.
     */
    show () {
        this.open = true;
    }

    /**
     * Closes the dialog with a result.
     * @param result
     */
    close (result) {
        this.result = result;
        this.open   = false;
    }

    /**
     * Closes the dialog when the backdrop is clicked.
     */
    onBackdropClick () {
        if (this.assertClosing()) {
            this.close();
        }
    }

    /**
     * Closes the dialog when escape is pressed.
     */
    onKeyDown (evt) {
        switch (evt.code) {
            case "Escape":
                if (this.assertClosing()) {
                    this.close();

                    // If there are more dialogs, we don't want to close those also :-)
                    evt.stopImmediatePropagation();
                }
                break;
        }
    }

    /**
     * Dispatches an event that, if asserts whether the dialog can be closed.
     * If "preventDefault()" is called on the event, assertClosing will return true
     * if the event was not cancelled. It will return false if the event was cancelled.
     */
    assertClosing () {
        return this.dispatchEvent(new CustomEvent("closing", {cancelable: true}));
    }

    /**
     * Setup the dialog after it has opened.
     */
    didOpen () {
        // Save the current active element so we have a way of restoring the focus when the dialog is closed.
        this.$previousActiveElement = FloatingDialog.traverseActiveElements(document.activeElement);

        // Focus the first element in the focus trap.
        // Wait for the dialog to show its content before we try to focus inside it.
        // We request an animation frame to make sure the content is now visible.
        requestAnimationFrame(() => {
            this.$dialog.focusFirstElement();
        });

        // Make the dialog focusable
        this.tabIndex = 0;

        // Block the scrolling on the scroll container to avoid the outside content to scroll.
        this.$scrollContainer.style.overflow = `hidden`;

        // Listen for key down events to close the dialog when escape is pressed.
        this.addEventListener("keydown", this.onKeyDown, {capture: true, passive: true});

        // Increment the dialog count with one to keep track of how many dialogs are currently nested.
        FloatingDialog.setDialogCount(this.$scrollContainer,
                                      FloatingDialog.getDialogCount(this.$scrollContainer) + 1);

        // Dispatch an event so the rest of the world knows the dialog opened.
        this.dispatchEvent(new Event("open"));
    }

    /**
     * Clean up the dialog after it has closed.
     */
    didClose () {
        // Remove the listener listening for key events
        this.removeEventListener("keydown", this.onKeyDown, {capture: true});

        // Decrement the dialog count with one to keep track of how many dialogs are currently nested.
        this.setDialogCount(
            this.$scrollContainer,
            Math.max(0, FloatingDialog.getDialogCount(this.$scrollContainer) - 1)
        );

        // If there are now 0 active dialogs we unblock the scrolling from the scroll container.
        // This is because we know that no other dialogs are currently nested within the scroll container.
        if (this.getDialogCount(this.$scrollContainer) <= 0) {
            this.$scrollContainer.style.overflow = ``;
        }

        // Make the dialog unfocusable.
        this.tabIndex = -1;

        // Restore previous active element.
        if (this.$previousActiveElement != null) {
            this.$previousActiveElement.focus();
            this.$previousActiveElement = null;
        }

        // Dispatch an event so the rest of the world knows the dialog closed.
        // If a result has been set, the result is added to the detail property of the event.
        this.dispatchEvent(new CustomEvent("close", {detail: this.result}));
    }

    /**
     * Reacts when an observed attribute changes.
     */
    attributeChangedCallback (name, newValue, oldValue) {
        switch (name) {
            case "open":
                this.open ? this.didOpen() : this.didClose();
                break;
        }
    }

    static get defaultDialogStyle() { return `

        * {
            box-sizing: border-box;
        }

        :host {
            padding: var(--dialog-container-padding, 5vw 24px);
            z-index: var(--dialog-z-index, 12345678);
            outline: none;
        }

        :host,
        #backdrop {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }

        :host,
        :host([center]) #dialog {
            overflow-x: var(--dialog-overflow-x, hidden);
            overflow-y: var(--dialog-overflow-y, auto);
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
        }

        :host([center]) {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        :host([center]) #dialog {
            max-height: var(--dialog-max-height, 100%);
        }

        :host(:not([open])),
        :host(:not(:defined)) {
            display: none;
        }

        #backdrop {
            background:       var(--dialog-backdrop-bg, rgba(0, 0, 0, 0.6));
            animation: fadeIn var(--dialog-animation-duration, 100ms)
                              var(--dialog-animation-easing, ease-out);
            z-index: -1;
        }

         dialog {
             display:none;
        }

        #dialog {
            @property --dialog-top {
                syntax: "<length>";
                inherits: false;
                initial-value: unset;
            }
            @property --dialog-left {
                syntax: "<length>";
                inherits: false;
                initial-value: unset;
            }
            @property --dialog-bottom {
                syntax: "<length>";
                inherits: false;
                initial-value: unset;
            }
            @property --dialog-right {
                syntax: "<length>";
                inherits: false;
                initial-value: unset;
            }
            @property --dialog-padding {
                syntax: "<length>";
                inherits: false;
                initial-value: 5px;
            }
            /* --dialog-padding: 5px; */

            animation: scaleIn  var(--dialog-animation-duration, 100ms)
                                var(--dialog-animation-easing, ease-out);
            border-radius:      var(--dialog-border-radius, 12px);
            box-shadow:         var(--dialog-box-shadow, 0 2px 10px -5px rgba(0, 0, 0, 0.6));
            max-width:          var(--dialog-max-width, 700px);
            width:              var(--dialog-width, 100%);
            padding:            var(--dialog-padding, 24px);
            max-height:         var(--dialog-max-height, unset);
            height:             var(--dialog-height, auto);
            color:              var(--dialog-color, currentColor);
            background:         var(--dialog-bg, white);
            z-index: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            border: none;
        }

        ::slotted(article),
        article {
            flex-grow: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }

        ::slotted(header),
        header,
        ::slotted(footer),
        footer {
            flex-shrink: 0;
        }

        @keyframes scaleIn {
              0% { transform: scale(0.9) translateY(30px);  opacity: 0; }
            100% { transform: scale(1)   translateY(0);     opacity: 1; }
        }
        @keyframes fadeIn {
              0% { opacity: 0; }
            100% { opacity: 1; }
        }
    `;}

    static get dialogTemplate() { return `
        <style>${this.defaultDialogStyle}</style>
        <div id="backdrop" part="backdrop"></div>
        <dialog id="dialog" part="dialog">
            <slot></slot>
        </dialog>
    `;}

    /* Returns the data dialog count for an element.
     * @param $elem
     */
    static getDialogCount ($elem) {
        return Number($elem.getAttribute(`data-dialog-count`)) || 0;
    }

    /**
     * Sets the data dialog count for an element.
     * @param $elem
     * @param count
     */
    static setDialogCount ($elem, count) {
        $elem.setAttribute(`data-dialog-count`, count.toString());
    }

    static traverseActiveElements (activeElement = document.activeElement) {
        if (activeElement != null &&
            activeElement.shadowRoot != null &&
            activeElement.shadowRoot.activeElement != null) {
            return this.traverseActiveElements(activeElement.shadowRoot.activeElement);
        }
        return activeElement;
    }

    static openDialog({ $content,                                       // Node | (($dialog) => void)
                        $container = document.body,                     // HTMLElement
                        center     = false,                             // boolean
                        initialize = (() => new FloatingDialog()) } = {}) {  // (() => <FloatingDialog>)
        // Construct the dialog.
        const $dialog = initialize();

        // Set the relevant properties of the dialog.
        if (center != null) {
            $dialog.center = center;
        }

        // Attach the content to the dialog.
        if ($content != null) {
            if (typeof $content === "function") {
                $content($dialog);
            } else {
                $dialog.appendChild($content);
            }
        }

        // Create a resolver that resolves when the dialog closes.
        const resolver = new Promise(res => {
            $dialog.addEventListener("close", (evt) => {
                $dialog.remove();
                res(evt.detail);
            }, {once: true});
        });

        // Append the dialog to the container and open it.
        $container.appendChild($dialog);
        $dialog.show();

        return {$dialog, resolver};
    }

    static {
        this.template = document.createElement("template");
        this.template.innerHTML = this.dialogTemplate;

        customElements.define("floating-dialog", FloatingDialog);
    }
}












