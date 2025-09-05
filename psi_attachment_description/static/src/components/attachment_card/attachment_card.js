/* @odoo-module */

import { useService } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";
import { AttachmentList } from "@mail/core/common/attachment_list";
import { FormViewDialog } from "@web/views/view_dialogs/form_view_dialog";
import { _t } from "@web/core/l10n/translation";

/**
 * Patch for AttachmentList component
 * Adds the ability to open a description form for attachments.
 */
patch(AttachmentList.prototype, {
    /**
     * Initialize the component.
     * Loads the dialog service used to open forms.
     */
    setup() {
        super.setup?.();
        this.dialog = useService('dialog');
    },

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    /**
     * Extends the list of actions available for an attachment.
     * Adds a "Description" button that opens the description form dialog.
     *
     * @param {Object} attachment - the current attachment
     * @returns {Array} actions - list of actions for the attachment
     */
    getActions(attachment) {
        const actions = super.getActions(attachment);
        actions.push({
            label: _t("Description"),
            icon: "fa fa-comments",
            onSelect: () => this._onClickDescription(attachment),
        });
        return actions;
    },

    //----------------------------------------------------------------------
    // Handlers
    //----------------------------------------------------------------------

    /**
     * Handles click on the "Description" action.
     * Opens a FormViewDialog for the given attachment record.
     *
     * @param {Object} attachment - the selected attachment
     */
    _onClickDescription(attachment) {
        this.dialog.add(FormViewDialog, {
            resModel: "ir.attachment",
            resId: attachment.id,
            context: {
                form_view_ref: 'psi_attachment_description.attachment_description_form',
            },
            title: _t("Description"),
            onRecordSaved: () => {
                this._reload();
            },
        });
    },

    //----------------------------------------------------------------------
    // Private
    //----------------------------------------------------------------------

    /**
     * Reloads the attachment list after saving changes in the dialog.
     * Handles both cases when the component has `props.record`
     * or when it works with a model from the environment.
     */
    async _reload() {
        if (this.props.record) {
            await this.props.record.load();
            this.render(true);
        }
        else if (this.env.model) {
            await this.env.model.load();
            this.render(true);
        }
    }
}
, { name: "psi_attachment_description.AttachmentListPatch" });
