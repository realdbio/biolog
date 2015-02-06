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
//            "ok": {
//                closeModalOnClick: false, // if this is false, dialog doesnt close automatically on click
//                class: 'btn-info',
//                label: 'Save'
//            },
            "cancel": {
                class: 'btn-danger',
                label: 'Close'
            }
        }
    };

    objDialog = ReactiveModal.initDialog(objDialogSpec);

});