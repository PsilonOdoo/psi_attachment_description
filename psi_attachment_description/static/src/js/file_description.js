/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

const OriginalForm = publicWidget.registry.s_website_form;

publicWidget.registry.s_website_form = OriginalForm.extend({

    events: Object.assign({}, OriginalForm.prototype.events, {
        "click .o_file_description_btn": "_onDescriptionBtnClick",
        "input .o_file_description_input": "_onDescriptionInput",
    }),

    /**
     * Toggle the visibility of the description input.
     */
    _onDescriptionBtnClick: function (ev) {
        const btn = ev.currentTarget;
        const block = btn.closest(".o_file_wrap").querySelector(".o_file_description_block");
        if (block) {
            block.classList.toggle("d-none");
            const input = block.querySelector(".o_file_description_input");
            input?.focus();
        }
    },

    /**
     * Update the data-description attribute when typing in input.
     */
    _onDescriptionInput: function (ev) {
        const input = ev.currentTarget;
        const fileBlock = input.closest(".o_file_block");
        if (fileBlock) {
            fileBlock.dataset.description = input.value;
        }
    },

    /**
     * Override the send function to inject descriptions into serializeArray.
     */
    async send(e) {

         // If the model is mail.mail, we do not add additional fields (so that the signature matches).
        const modelName = this.$el.data('model_name');
        if (modelName === 'mail.mail') {
            console.log(modelName)
            return await this._super.apply(this, arguments);
        }

        const self = this;
        const oldSerialize = this.$el.serializeArray;
        this.$el.serializeArray = function () {
            const base = oldSerialize.call(this);

            let blockCounter = 0;
            $.each(self.$el.find('input[type=file]:not([disabled])'), (outer_index, input) => {
                $.each($(input).prop('files'), function (index, file) {
                    const fieldName = input.name + '[' + outer_index + '][' + index + ']';
                    const $block = self.$el.find(".o_files_zone .o_file_block").eq(blockCounter);
                    const desc = $block.data("description") || $block.find(".o_file_description_input").val();
                    if (desc) {
                        base.push({ name: `description[${fieldName}]`, value: desc });
                        console.log({ name: `description[${fieldName}]`, value: desc });
                    }
                    blockCounter++;
                });
            });
            return base;
        };
        const result = await this._super.apply(this, arguments);
        this.$el.serializeArray = oldSerialize;

        return result;
    },
});
