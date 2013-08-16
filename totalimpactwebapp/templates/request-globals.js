/******************************************************************************
 *
 *  Set JS globals that are specific to a given Flask request
 *
 ******************************************************************************/


/* User-specific stuff
********************************************************/

// {% if login_status == "logged-in" %}
    var tiUserIsLoggedIn = true
    var impactstoryUserId = '{{ g.user.id }}'
    var userDict = {}
    // {% for k, v in g.user.__dict__.iteritems() %}
        userDict['{{ k }}'] = '{{ v }}';
    // {% endfor %}

// {% else %}
    var tiUserIsLoggedIn = false

// {% endif %}



