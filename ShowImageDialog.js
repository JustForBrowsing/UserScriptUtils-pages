// ==UserLibrary==
// @name        ShowImageDialog
// @author      Me
// @version     0.1.0
// @description Adds functionality to the Daz3D web site
// ==/UserLibrary
console.log(`%c${GM_info.script.name}: loading...`, 'color:#4060FF;');

class ShowImageDialogOptions {
    dialogId                            = 'showImageDialog';

    #defaultOpenButtonInsertPosition    = 'afterbegin';
    #defaultOpenButtonInsertSelector    = '.product_image_container';
    dialogInsertPosition                = 'afterbegin';
    dialogInsertSelector                = 'body';
    dialogCSSClass                      = 'image-dialog';
    openButtonCSSClass                  = 'image-dialog-btn';
    dialogAriaLabel                     = 'Product Images';

    splideOptions                       = { heightRatio: 0.5, };

    constructor(options) {
        Object.assign(this, options);

        this.dialogCSSClass.replace(/^(\.{0,1})/g, '');     // Trim leading '.'
        this.openButtonCSSClass.replace(/^(\.{0,1})/g, ''); // Trim leading '.'
    }
}

class ShowImageDialog extends EventTarget {
    #options                        = null;
    showImageDialog                 = null;
    showImageDialogImgList          = null;
    showImageDialogOpenBtn          = null;
    showImageDialogCloseBtn         = null;

    #splide                         = null;
    #imageSourceUrls                = [];

    constructor(imgUrlList, options) {
        super();
        if ((imgUrlList instanceof Set) || (imgUrlList instanceof Map)) {
            this.#imageSourceUrls = [...imgUrlList.keys()];

        } else if (Array.isArray(imgUrlList)) {
            this.#imageSourceUrls = imgUrlList;

        } else {
            // try to make it an array first
            this.#imageSourceUrls = Array.from(imgUrlList);
        }

        this.#options = Object.assign(new ShowImageDialogOptions(), options);

        this.addImageDialogToPage() // This also adds images from imgUrlList
        .then((dialogAvailable) => {
            if (dialogAvailable) {
                if (this.#options.openButtonInsertPosition &&
                    this.#options.openButtonInsertSelector) {
                    this.addImageDialogOpenButtonToPage();
                }
            } else {
                console.log(`Dialog not available.`);
            }

            console.debug(`before new Splide`);
            this.#splide = new Splide(this.imgListId, this.#options.splideOptions).mount();
            console.debug(`after new Splide`);
        });
    }

    get options()       { return this.#options; }
    get open()          { return this.showImageDialog?.open ?? false; }

    get dialogId()      { return this.#options.dialogId; }
    get dialogStyleId() { return `${this.dialogId}Style`; }
    get imgListId()     { return `${this.dialogId}ImgList`; }
    get openBtnId()     { return `${this.dialogId}OpenBtn`; }

    showModal()         { this.showImageDialog.showModal(); }
    show()              { this.showImageDialog.show(); }
    close()             { this.showImageDialog.close(); }

    addImages(...imageSourceUrls) {
        const imgListFrag = document.createDocumentFragment();
        for(const imgUrl of imageSourceUrls.flat()) {
            if (!this.#imageSourceUrls.includes(imgUrl)) {
                this.#imageSourceUrls.push(imgUrl);

                const imgItemFrag = document.createRange()
                                            .createContextualFragment(this.#buildImgListItem(imgUrl));
                imgListFrag.appendChild(imgItemFrag);
            }
        }
        this.showImageDialogImgList.appendChild(imgListFrag);
    }

    clearImages() {
        // Clear current image list (if any)
        this.showImageDialogImgList.replaceChildren();
    }

    async addImageDialogToPage(debug = null) {
        // Remove any existing dialog
        this.showImageDialog = document.getElementById(this.dialogId);
        this.showImageDialog?.remove();

        // Insert dialog template
        const dialogString = this.#buildDialogString();
        const waitForDialogInsertSelector = new WaitForElement(this.#options.dialogInsertSelector);
        const dialogTargetElement = await waitForDialogInsertSelector.waitAsync();
        dialogTargetElement.insertAdjacentHTML(this.#options.dialogInsertPosition,
                                               dialogString);
        this.showImageDialog        = document.getElementById(this.dialogId);
        this.showImageDialogImgList = this.showImageDialog?.querySelector('ul.splide__list');
        if (this.showImageDialog == null) {
            throw new Error(`${GM_info.script.name}:ShowImageDialog.addImageDialogToPage: error, could not get dialog this.#showImageDialog, this.dialogId:${this.dialogId}, dialogTargetElement:${dialogTargetElement}.`);
        }
        this.clearImages();

        // Add new image items to view
        const imgItemStrings = this.#imageSourceUrls.map(this.#buildImgListItem);
        this.addImages(imgItemStrings);

        // Hookup the dialog to close when clicked outside image
        this.showImageDialog.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.showImageDialog.close();
        });

        this.showImageDialog.addEventListener('close', (evt) => {
            evt.preventDefault();
            this.#raiseCloseEvent();
        });

        // evt.stopImmediatePropagation();
        this.#raiseLoadEvent();

        return true;
    }

    addImageDialogOpenButton(elementOrSelector, elementPosition = 'afterbegin', modal = true) {
        this.showImageDialogOpenBtn?.remove();

        let openMethod = this.showImageDialog.showModal;
        if (!modal) {
            openMethod = this.showImageDialog.show;
        }

        const buttonString = this.#buildOpenButtonString();
        let newNode = null;
        if (elementOrSelector instanceof Node) {
            newNode = elementOrSelector;
        } else {
            newNode = document.querySelector(elementOrSelector);
        }
        newNode.insertAdjacentHTML(elementPosition, buttonString);

        this.showImageDialogBtn = document.getElementById(this.openBtnId);
        if (this.showImageDialogBtn) {
            this.showImageDialogBtn.addEventListener('click', (evt) => {
                evt.preventDefault();
                openMethod();
            });
        }
    }

    #raiseLoadEvent() {
        const loadEvent = new Event('load');
        this.dispatchEvent(loadEvent);
    }

    #raiseCloseEvent() {
        const closeEvent = new Event('close');
        this.dispatchEvent(closeEvent);
    }

    #raiseClosingEvent() {
        const closingEvent = new CustomEvent('closing', {
            bubbles: true,
            cancelable: true,
            detail: 'This is awesome. I could also be an object or array.',
        });
        let canceled = !this.dispatchEvent(closingEvent);
        return canceled;
    }

    #buildImgListItem(imageUrl) {
        return `<li class="splide__slide"><img src="${imageUrl}" alt=""></li>`;
    }

    #buildDialogString() {
        return `
            <dialog id="${this.dialogId}" class="${this.dialogCSSClass}">
                <div class="splide" role="group" aria-label="${this.#options.dialogAriaLabel}">
                    <div class="splide__track">
                        <ul id="${this.dialogId}ImgList" class="splide__list">
                        </ul>
                    </div>
                </div>
            </dialog>
        `;
    }

    #buildCssStyleString() {
        return `
            <style id="${this.dialogStyleId}">
                ${this.dialogId} .splide__slide img {
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                }
            </style>
        `;
    }

    #buildOpenButtonString() {
        return  `
            <button id="${this.dialogId}OpenBtn" type="button"
                    class="${this.#options.openButtonCSSClass}">
                <i class="fa-solid fa-image">Image</i>
            </button>
        `;
    }
}

