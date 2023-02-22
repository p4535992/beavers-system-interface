export class SelectDialog extends Application {
    selectData: SelectData
    callback;
    selected: string;

    static promise(data: SelectData) {
        return new Promise<string>((resolve) => {
            const keys = Object.keys(data.choices);
            if(keys.length === 1){
                resolve(keys[0]);
                return;
            }
            if(keys.length === 0){
                resolve("");
                return;
            }
            new SelectDialog(
                data,
                resolve
            ).render(true);
        });
    }

    constructor(data: SelectData , callback: (id: string | PromiseLike<string>) => void, options?: Partial<Application.Options>) {
        super(options);
        this.selectData = data;
        this.callback = callback;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: game["i18n"].localize(`beaversSystemInterface.select-dialog.title`),
            width: 300,
            height: 80,
            template: "modules/beavers-system-interface/templates/select.hbs",
            resizable: false,
            classes: ["select-dialog"],
            popOut: true
        });
    }

    getData() {
        return mergeObject(this.selectData,{size:"l"});
    }

    activateListeners(html: JQuery) {
        html.find("input").on("input", () => {
            const result = html.find("input").val() as string;
            this.selected = result;
            if (result != "") {
                this.close();
            }
        })
    }

    close(options?: Application.CloseOptions): Promise<void> {
        const result = super.close(options);
        this.callback(this.selected);
        return result;
    }


}

