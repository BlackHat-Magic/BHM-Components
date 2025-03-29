from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)

app.config["SECRET_KEY"] = "somesecretkey"

@app.route("/")
def home():
    return(render_template("index.html"))

@app.route("/Accordion")
def accordion():
    return(render_template(
        "accordion-demo.html",
        accordion_data=[
            {
                "title": "Foo",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
                "title": "Bar",
                "content": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                "title": "Fizz",
                "content": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            },
            {
                "title": "Buzz",
                "content": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            },
            {
                "title": "Baz",
                "content": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
            }
        ]
    ))

@app.route("/Banner")
def banner():
    flash("This is an info flash", "info")
    flash("This is a success flash", "success")
    flash("This is a warning flash", "warning")
    flash("This is an error flash", "error")
    return(render_template("banner-demo.html"))

@app.route("/Copy-Button")
def copy_button():
    return(render_template("copy_btn-demo.html"))

@app.route("/Date-Picker")
def date_picker():
    return(render_template("date_picker-demo.html"))

@app.route("/Dropdown")
def dropdown():
    return(render_template("dropdown-demo.html"))
    
@app.route("/Hovercard")
def hovercard():
    return(render_template("hovercard-demo.html"))

@app.route("/Menubar")
def menubar():
    return(render_template("menubar-demo.html"))

@app.route("/Modal")
def modal():
    return(render_template("modal-demo.html"))

@app.route("/Popover")
def popover():
    return(render_template("popover-demo.html"))

@app.route("/Radio-Group", methods=["GET", "POST"])
def radio_group():
    if(request.method == "POST"):
        return(redirect(url_for("radio_group")))
    return(render_template("radio_group-demo.html"))

@app.route("/Select", methods=["GET", "POST"])
def select():
    if(request.method == "POST"):
        return(redirect(url_for("select")))
    return(render_template("select-demo.html"))

@app.route("/Sidebar")
def sidebar():
    return(render_template("sidebar-demo.html"))

@app.route("/Tabs")
def tabs():
    return(render_template("tabs-demo.html"))

@app.route("/Toggle-Switch", methods=["GET", "POST"])
def toggle_switch():
    if(request.method == "POST"):
        return(redirect(url_for("toggle_switch")))
    return(render_template("toggle_switch-demo.html"))

if(__name__ == "__main__"):
    app.run(debug=True)