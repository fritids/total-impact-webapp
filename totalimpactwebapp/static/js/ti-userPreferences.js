var UserPreferences = function(options) {
    this.options = options
    if (typeof impactstoryUserId == "undefined") return false
    this.init()
}

UserPreferences.prototype = {
    init: function(){
        this.clickNameToModify()
        this.clickUrlSlugToModify()
        this.clickEmailToModify()
        this.changePassword()
    }
    , clickNameToModify: function(){
        $("body.can-edit .editable-name span.editable").each(function(){
            var title = "Edit " + ($(this).attr("data-name").replace("_", " "))
            $(this).editable({
                                 type: "text",
                                 pk: impactstoryUserId,
                                 url: "/user/"+impactstoryUserId,
                                 title: title,
                                 ajaxOptions: {
                                     type: 'PUT'
                                 }
                             })
        })
    }
    ,clickEmailToModify: function(){
        $("span.email.editable").editable({
            type: "text",
            name: "email",
            pk: impactstoryUserId,
            url: "/user/"+impactstoryUserId,
            mode: "inline",
            ajaxOptions: {
                type: 'PUT'
            },
            success: function(response, newValue){
                // super super hacky...refactor and reuse elsewhere, later.
                $("<span class='msg success'>changed!</span>")
                    .appendTo("div.email h3")
                    .fadeOut(2000)
            },
            error: function(response, newValue){
                if (response.status === 409) {
                  return "Sorry, someone has already registered that email..."
                }
                else {
                  response.responseText // whatever the server sent back...
                }
            }
        })
    }
    , clickUrlSlugToModify: function() {
        $("span.slug.editable").editable({
            type: "text",
            name: "slug",
            pk: impactstoryUserId,
            url: "/user/"+impactstoryUserId+"?fail_on_duplicate=true",
            mode: "inline",
            ajaxOptions: {
                type: 'PUT'
            },
            success: function(response, newValue){
                window.location = webapp_root_pretty + "/" + newValue + "/preferences"
            },
            error: function(response, newValue){
                if (response.status === 409) {
                    return "Whoops, looks like someone else is already using that URL..."
                }
                else if (response.status === 400) {
                    return "Only letters, numbers, apostrophes, and dashes are allowed."
                }
                else {
                    response.responseText
                }
            }
        })
    }
    , changePassword: function(){
        $("#change-pw").submit(function(){
            var this$ = $(this)

            // make sure the new pw was entered correctly twice
            if ($("#new-pw").val() != $("#confirm-new-pw").val()) {
                $("div.control-group.confirm-new-pw").addClass("error")
                return false
            }


            var requestObj = {
                current_password: $("#current-pw").val(),
                new_password: $("#new-pw").val()
            }

            changeControlGroupState(
                this$.find("div.control-group"),
                "working"
            )

            $.ajax({
                url: webapp_root_pretty+'/user/' + impactstoryUserId + '/password',
                type: "PUT",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data:  JSON.stringify(requestObj),
                success: function(data){
                    changeControlGroupState(
                        $("div.control-group"),
                        "ready"
                    )
                    $("span.pw-changed").show().fadeOut(2000)
                    this$.find("input").val("").blur()

                },
                error: function(e, textStatus, errorThrown) {
                    if (e.status === 403) {
                        changeControlGroupState(
                            $("div.control-group.enter-current-pw"),
                            "error"
                        )
                        // stop the spinner gif, bring back submit button.
                        changeControlGroupState(
                            $("div.control-group.confirm-new-pw"),
                            "ready"
                        )
                    }
                }

            })





            return false;
        })
    }
}

