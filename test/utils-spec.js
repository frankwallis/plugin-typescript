import should from 'should';

import {isRelative} from '../lib/utils';
import {isAbsolute} from '../lib/utils';
import {isAmbientImport} from '../lib/utils';
import {isTypescript} from '../lib/utils';
import {isTypescriptDeclaration} from '../lib/utils';
import {isJavaScript} from '../lib/utils';
import {isSourceMap} from '../lib/utils';
import {tsToJs} from '../lib/utils';
import {tsToJsMap} from '../lib/utils';

describe( 'Utils', () => {

	describe( 'isRelative', () => {
		it('does not match absolute paths', () => {
			isRelative("/a/b.c").should.be.false;
			isRelative("/a/b").should.be.false;
		});

		it('matches relative paths', () => {
			isRelative("../a/b").should.be.true;
			isRelative("./a/b").should.be.true;
		});

		it('does not match external paths', () => {
			isRelative("b").should.be.false;
			isRelative("a/b.c").should.be.false;
		});
	});

	describe( 'isAbsolute', () => {
		it('matches absolute paths', () => {
			isAbsolute("/a/b.c").should.be.true;
			isAbsolute("/a/b").should.be.true;
		});

		it('does not match relative paths', () => {
			isAbsolute("../a/b").should.be.false;
			isAbsolute("./a/b").should.be.false;
		});

		it('does not match external paths', () => {
			isAbsolute("b").should.be.false;
			isAbsolute("a/b.c").should.be.false;
		});
	});

	describe( 'isAmbientImport', () => {
		it('does not match absolute paths', () => {
			isAmbientImport("/a/b.c").should.be.false;
			isAmbientImport("/a/b").should.be.false;
		});

		it('does not match relative paths', () => {
			isAmbientImport("../a/b").should.be.false;
			isAmbientImport("./a/b").should.be.false;
		});

		it('matches external paths', () => {
			isAmbientImport("b").should.be.true;
			isAmbientImport("a/b.c").should.be.true;
		});
	});

	describe( 'tsToJs', () => {
		it('changes the file extension', () => {
			tsToJs('a.ts').should.be.equal('a.js');
			tsToJs('a.ts.ts').should.be.equal('a.ts.js');
		});

		it('ignores files with wrong extension', () => {
			tsToJs('a.jts').should.be.equal('a.jts');
		});
	});

	describe( 'tsToJsMap', () => {
		it('changes the file extension', () => {
			tsToJsMap('a.ts').should.be.equal('a.js.map');
			tsToJsMap('a.ts.ts').should.be.equal('a.ts.js.map');
		});

		it('ignores files with wrong extension', () => {
			tsToJsMap('a.jts').should.be.equal('a.jts');
		});
	});

	describe( 'isTypescript', () => {
		it('detects source files', () => {
			isTypescript('a.ts').should.be.true;
			isTypescript('a.js').should.be.false;
			isTypescript('a.ts.js').should.be.false;
			isTypescript('a.ts.ats').should.be.false;
		});

		it('detects declaration files', () => {
			isTypescript('a.d.ts').should.be.true;
		});

		it('detects tsx files', () => {
			isTypescript('a.d.tsx').should.be.true;
			isTypescript('a.tsx').should.be.true;
		});
	});

	describe( 'isJavaScript', () => {
		it('detects javascript source files', () => {
			isJavaScript('a.ts').should.be.false;
			isJavaScript('a.js').should.be.true;
			isJavaScript('a.ts.js').should.be.true;
			isJavaScript('a.ts.ajs').should.be.false;
		});
	});

	describe( 'isSourceMap', () => {
		it('detects source map files', () => {
			isSourceMap('a.map').should.be.true;
			isSourceMap('a.jmap').should.be.false;
			isSourceMap('a.mapj').should.be.false;
		});
	});

	describe( 'isTypescriptDeclaration', () => {
		it('detects declaration files', () => {
			isTypescriptDeclaration('a.d.ts').should.be.true;
			isTypescriptDeclaration('a.js').should.be.false;
			isTypescriptDeclaration('a.d.ts.js').should.be.false;
			isTypescriptDeclaration('a.ts.ats').should.be.false;
		});

		it('detects tsx declaration files', () => {
			isTypescriptDeclaration('a.d.tsx').should.be.true;
		});

		it('ignores source files', () => {
			isTypescriptDeclaration('a.ts').should.be.false;
			isTypescriptDeclaration('a.tsx').should.be.false;
		});
	});

});
