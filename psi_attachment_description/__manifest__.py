# -*- coding: utf-8 -*-
{
    'name': "Forms Attachment Description",
    'summary': "Adds descriptions to attachments in Odoo.",
    'description': """This module allows you to add descriptions to attachments across any Odoo model that supports the chatter.
        Descriptions can be added in forms on the website or in the backend using the chatter.
        Works for all types of attachments, including documents and images.
""",

    'author': "Psilon Sp. z o.o.",
    'website': "https://pomoc.psilon.pl/",

    'category': 'Uncategorized',
    'license': 'OPL-1',
    'version': '18.0.0.1',

    'depends': ['base', 'website', 'mail'],
    'data': [
        'views/assets.xml',
        'views/ir_attachment.xml'
    ],
    'assets': {
        'web.assets_backend': [
            'psi_attachment_description/static/src/components/*/*.xml',
            'psi_attachment_description/static/src/components/*/*.js',
            'psi_attachment_description/static/src/components/*/*.scss'
        ],
    },

    "installable": True,
    "application": False,
    'auto_install': False,
    
    'images': ['static/description/banner.png'],
    'price': 9.99,
    'currency': 'EUR'
}
