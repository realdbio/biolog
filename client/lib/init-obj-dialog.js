Meteor.startup(function() {

    var objDialogSpec = {
        id: "objDialog",
        template: Template.valueSelector,
        title: "Select Value",
        modalDialogClass: "obj-dialog", //optional
        modalBodyClass: "obj-dialog-body", //optional
        modalFooterClass: "obj-dialog-footer",//optional
        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "cancel": {
                class: 'btn-danger',
                label: 'Close'
            }
        }
    };

    objDialog = ReactiveModal.initDialog(objDialogSpec);

    var thenObjDialogSpec = {
        id: "thenObjDialog",
        template: Template.thenValueSelector,
        title: "Select Value",
        modalDialogClass: "obj-dialog", //optional
        modalBodyClass: "obj-dialog-body", //optional
        modalFooterClass: "obj-dialog-footer",//optional
        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "cancel": {
                class: 'btn-danger',
                label: 'Close'
            }
        }
    };

    thenObjDialog = ReactiveModal.initDialog(thenObjDialogSpec);

});