/**
 * Created by admin on 2016/8/17.
 */
'use strict';

module.exports = {

    load() {
        console.log('package loaded');
    },

    unload() {
        console.log('package unloaded');
    },

    messages: {
        open() {
            Editor.Panel.open('ordiry-package');
        },
        close() {
            Editor.Panel.close('ordiry-package');
        },
        obtain() {
            let arrt = Editor.MainMenu.menu.nativeMenu.items;
            Editor.Ipc.sendToPanel('ordiry-package', 'huoqu:atyle', arrt);
        }

    }
};
