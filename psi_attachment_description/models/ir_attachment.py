# -*- coding: utf-8 -*-

from odoo import _, models
from odoo.addons.mail.tools.discuss import Store


class IrAttachment(models.Model):
    _inherit = 'ir.attachment'

    def _to_store(self, store: Store, /, *, fields=None, extra_fields=None):
        """
        Adds attachment data to the store.
        The 'fields' list has been extended to include 'description'.
        """

        if fields is None:
            fields = [
                "checksum",
                "create_date",
                "filename",
                "mimetype",
                "name",
                "res_name",
                "size",
                "thread",
                "type",
                "url",
                "description"
            ]
        if extra_fields:
            fields.extend(extra_fields)
        for attachment in self:
            data = attachment._read_format(
                [field for field in fields if field not in ["filename", "size", "thread"]],
                load=False,
            )[0]
            if "filename" in fields:
                data["filename"] = attachment.name
            if "size" in fields:
                data["size"] = attachment.file_size
            if "thread" in fields:
                data["thread"] = (
                    Store.one(
                        self.env[attachment.res_model].browse(attachment.res_id),
                        as_thread=True,
                        only_id=True,
                    )
                    if attachment.res_model != "mail.compose.message" and attachment.res_id
                    else False
                )
            store.add(attachment, data)
