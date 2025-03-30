from flask import Blueprint

components_bp = Blueprint(
    "bhm_components",
    __name__,
    template_folder="templates",
    static_folder="static",
    # Optional: Define a static URL path if needed, otherwise defaults to /static
    # static_url_path='/component_assets'
)