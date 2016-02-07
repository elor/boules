##################################################################
# Build all or individual projects.															 #
# For more options, run `make ...` in the individual directories #
##################################################################

# primary build targets

VERSION=$(shell cat Version)
GITHEAD=$(shell git rev-parse HEAD | head -c8)

build: clean
	make templates scripts
	make basic boule tac test build/index.html
	./tools/write-manifest.sh build/
	cp -v Version build/

build/index.html:
	cp -v index.html build/

clean: FORCE
	make -C selenium-tests/ clean
	rm -rfv build/ dev/

# primary global targets

update: style templates test/index.html codestyle sprites lib links

templates: FORCE
	make basic/index.html boule/index.html tac/index.html -j

lib: FORCE
	./tools/install-libs.sh

links: FORCE
	./tools/verify-links.sh

scripts: FORCE
	./tools/create-commonjs.sh
	./tools/create-testjs.sh
	./tools/update-headers.sh

sprites: basic/images/sprite.png boule/images/sprite.png tac/images/sprite.png test/images/sprite.png

%/images/sprite.png: %/index.html FORCE
	./tools/write-sprite.sh $(shell dirname $<)

style: FORCE
	./tools/write-mainstyle.sh

codestyle: scripts
	./tools/codestyle.sh

# secondary global targets

clean-tools:
	rm -rf Makefile tools/ .jslintrc .jshintrc .travis.yml

release: FORCE
	./tools/prepare-release.sh

dev: clean
	./tools/apply-version.sh $(VERSION)-$(GITHEAD)
	make build
	mv build dev
	mv dev/index.html dev/index.html.bak
	./tools/apply-version.sh $(VERSION)
	mv dev/index.html.bak dev/index.html

merge-master: FORCE
	./tools/merge-master.sh

test/index.html: FORCE
	./tools/write-testindex.sh

%/index.html: %/scripts/main.js FORCE
	cd $(shell dirname $@) && ../tools/process-template.py

selenium-tests: FORCE
	make -C selenium-tests

# makefile-related secondary targets

%: %/index.html build-dir
	./tools/build.sh $@

build-dir: FORCE
	mkdir -p build

FORCE:
