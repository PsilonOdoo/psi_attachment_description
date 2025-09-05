from odoo.addons.website.controllers.form import WebsiteForm
from odoo import http, SUPERUSER_ID
from odoo.http import request


class WebsiteFormAttachment(WebsiteForm):

    def _handle_website_form(self, model_name, **kwargs):
        """
        Extract file descriptions from form kwargs, move them to
        request.context, then call the parent handler.

        :param model_name: name of the model being processed
        :param kwargs: form field values (descriptions are popped here)
        :return: result of the parent form handler
        """
        descriptions = {}
        for key in list(kwargs.keys()):
            if key.startswith("description["):
                descriptions[key] = kwargs.pop(key)

        if descriptions:
            request.update_context(file_descriptions=descriptions)

        return super()._handle_website_form(model_name, **kwargs)

    def insert_attachment(self, model, id_record, files):
        """
        Override of the standard `insert_attachment` method from WebsiteForm.

        Attach uploaded files and update their descriptions
        from request.context if provided.

        :param model: The model object where attachments are linked.
        :param id_record: The ID of the record to which attachments are related.
        :param files: A list of uploaded file objects to be attached.
        """
        super().insert_attachment(model, id_record, files)

        descriptions = request.context.get("file_descriptions", {})
        record = model.env[model.sudo().model].browse(id_record)
        for file in files:
            desc_key = f"description[{getattr(file, 'name', '')}]"
            description = descriptions.get(desc_key)
            if description:
                attachment = request.env['ir.attachment'].search([
                    ('res_model', '=', record._name),
                    ('res_id', '=', record.id),
                    ('name', '=', getattr(file, 'filename', ''))
                ], limit=1)
                if attachment:
                    attachment.write({'description': description})
