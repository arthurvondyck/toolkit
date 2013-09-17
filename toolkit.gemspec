Gem::Specification.new do |gem|
    gem.name = "titon-toolkit"
    gem.version = "0.11.1"

    # Info
    gem.authors = ["Titon", "Miles Johnson"]
    gem.description = "A powerful front-end UI and component library toolkit. The gem provides Sass files for use in projects."
    gem.summary = "The gem provides Toolkit Sass files for use in projects."
    gem.homepage = "http://titon.io"
    gem.license = "BSD-2"

    # Files
    gem.files = ["lib/titon-toolkit.rb"]
    gem.files += Dir.glob("scss/**/*")
    gem.files += Dir.glob("*.md")

    # Dependencies
    gem.add_dependency("sass", [">= 3.2.0"])
    gem.add_dependency("compass", [">= 0.11"])
end