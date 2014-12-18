
//addConditionDialog = null;

Meteor.startup(function(){
    var addConditionDialogSpec = {
        template: Template.addConditionDialog,
        title: "Add a condition",
        modalDialogClass: "add-condition-dialog", //optional
        modalBodyClass: "add-condition-body", //optional
        modalFooterClass: "add-condition-footer",//optional
        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "cancel": {
                class: 'btn-danger',
                label: 'Cancel'
            },
            "ok": {
                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'OK'
            }

        }
    };

    addConditionDialog = ReactiveModal.initDialog(addConditionDialogSpec);

    addConditionDialog.buttons.ok.on('click', function(button){
        alert('ok then');
    });

    addConditionDialog.buttons.cancel.on('click', function(button){
        alert('cancel then');
    });

});