declare const POSIX_CHARS: {
    DOT_LITERAL: string;
    PLUS_LITERAL: string;
    QMARK_LITERAL: string;
    SLASH_LITERAL: string;
    ONE_CHAR: string;
    QMARK: string;
    END_ANCHOR: string;
    DOTS_SLASH: string;
    NO_DOT: string;
    NO_DOTS: string;
    NO_DOT_SLASH: string;
    NO_DOTS_SLASH: string;
    QMARK_NO_DOT: string;
    STAR: string;
    START_ANCHOR: string;
};

/**
 * Windows glob regex
 */
declare const WINDOWS_CHARS: {
    SLASH_LITERAL: string;
    QMARK: string;
    STAR: string;
    DOTS_SLASH: string;
    NO_DOT: string;
    NO_DOTS: string;
    NO_DOT_SLASH: string;
    NO_DOTS_SLASH: string;
    QMARK_NO_DOT: string;
    START_ANCHOR: string;
    END_ANCHOR: string;
} & typeof POSIX_CHARS;

/**
 * POSIX Bracket Regex
 */
declare const POSIX_REGEX_SOURCE: {
    alnum: "a-zA-Z0-9";
    alpha: "a-zA-Z";
    ascii: "\\x00-\\x7F";
    blank: " \\t";
    cntrl: "\\x00-\\x1F\\x7F";
    digit: "0-9";
    graph: "\\x21-\\x7E";
    lower: "a-z";
    print: "\\x20-\\x7E ";
    punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~";
    space: " \\t\\r\\n\\v\\f";
    upper: "A-Z";
    word: "A-Za-z0-9_";
    xdigit: "A-Fa-f0-9";
};

export declare const constants: {
    MAX_LENGTH: number;
    POSIX_REGEX_SOURCE: typeof POSIX_REGEX_SOURCE;

    // regular expressions
    REGEX_BACKSLASH: RegExp;
    REGEX_NON_SPECIAL_CHARS: RegExp;
    REGEX_SPECIAL_CHARS: RegExp;
    REGEX_SPECIAL_CHARS_BACKREF: RegExp;
    REGEX_SPECIAL_CHARS_GLOBAL: RegExp;
    REGEX_REMOVE_BACKSLASH: RegExp;

    REPLACEMENTS: {
        "***": "*";
        "**/**": "**";
        "**/**/**": "**";
    };

    // Digits
    CHAR_0: number;
    CHAR_9: number;

    // Alphabet chars.
    CHAR_UPPERCASE_A: number;
    CHAR_LOWERCASE_A: number;
    CHAR_UPPERCASE_Z: number;
    CHAR_LOWERCASE_Z: number;

    CHAR_LEFT_PARENTHESES: number;
    CHAR_RIGHT_PARENTHESES: number;

    CHAR_ASTERISK: number;

    // Non-alphabetic chars.
    CHAR_AMPERSAND: number;
    CHAR_AT: number;
    CHAR_BACKWARD_SLASH: number;
    CHAR_CARRIAGE_RETURN: number;
    CHAR_CIRCUMFLEX_ACCENT: number;
    CHAR_COLON: number;
    CHAR_COMMA: number;
    CHAR_DOT: number;
    CHAR_DOUBLE_QUOTE: number;
    CHAR_EQUAL: number;
    CHAR_EXCLAMATION_MARK: number;
    CHAR_FORM_FEED: number;
    CHAR_FORWARD_SLASH: number;
    CHAR_GRAVE_ACCENT: number;
    CHAR_HASH: number;
    CHAR_HYPHEN_MINUS: number;
    CHAR_LEFT_ANGLE_BRACKET: number;
    CHAR_LEFT_CURLY_BRACE: number;
    CHAR_LEFT_SQUARE_BRACKET: number;
    CHAR_LINE_FEED: number;
    CHAR_NO_BREAK_SPACE: number;
    CHAR_PERCENT: number;
    CHAR_PLUS: number;
    CHAR_QUESTION_MARK: number;
    CHAR_RIGHT_ANGLE_BRACKET: number;
    CHAR_RIGHT_CURLY_BRACE: number;
    CHAR_RIGHT_SQUARE_BRACKET: number;
    CHAR_SEMICOLON: number;
    CHAR_SINGLE_QUOTE: number;
    CHAR_SPACE: number;
    CHAR_TAB: number;
    CHAR_UNDERSCORE: number;
    CHAR_VERTICAL_LINE: number;
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: number;

    SEP: string;

    extGlobChars(chars: { STAR: string }): Record<string, { type: string; open: string; close: string }>;

    globChars<T extends boolean>(win32: T): T extends true ? typeof WINDOWS_CHARS : typeof POSIX_CHARS;
};

//declare function parse(input: string, options: { maxLength?: number | undefined }): parse.ParseState;

declare namespace parse {
    interface Token {
        type: string;
        value: string;
        output: any;
    }

    interface ParseState {
        input: string;
        index: number;
        start: number;
        dot: boolean;
        consumed: string;
        output: string;
        prefix: string;
        backtrack: boolean;
        negated: boolean;
        negatedExtglob?: boolean | undefined;
        brackets: number;
        braces: number;
        parens: number;
        quotes: number;
        globstar: boolean;
        tokens: Token[];
    }
}

declare function scan(input: string, options?: scan.Options): scan.State;

declare namespace scan {
    interface Options {
        /**
         * When `true`, the returned object will include an array of strings representing each path "segment"
         * in the scanned glob pattern. This is automatically enabled when `options.tokens` is true
         */
        parts?: boolean | undefined;
        scanToEnd?: boolean | undefined;
        noext?: boolean | undefined;
        nonegate?: boolean | undefined;
        noparen?: boolean | undefined;
        unescape?: boolean | undefined;
        /**
         * When `true`, the returned object will include an array of tokens (objects),
         * representing each path "segment" in the scanned glob pattern
         */
        tokens?: boolean | undefined;
    }

    interface Token {
        value: string;
        depth: number;
        isGlob: boolean;
        backslashes?: boolean | undefined;
        isBrace?: boolean | undefined;
        isExtglob?: boolean | undefined;
        isGlobstar?: boolean | undefined;
        negated?: boolean | undefined;
    }

    interface State {
        prefix: string;
        input: string;
        start: number;
        base: string;
        glob: string;
        isBrace: boolean;
        isBracket: boolean;
        isGlob: boolean;
        isExtglob: boolean;
        isGlobstar: boolean;
        negated: boolean;
        negatedExtglob: boolean;
        maxDepth?: number | undefined;
        tokens?: Token[] | undefined;
        slashes?: number[] | undefined;
        parts?: string[] | undefined;
    }
}

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @param glob One or more glob patterns.
 * @param [options]
 * @param [returnState]
 * @return Returns a matcher function.
 * @api public
 */
declare function picomatch<T extends true | false = false>(
    glob: picomatch.Glob,
    options?: picomatch.PicomatchOptions,
    returnState?: T,
): T extends true ? picomatch.MatcherWithState : picomatch.Matcher;

declare namespace picomatch {
    type Glob = string | string[];

    interface Matcher {
        (test: string): boolean;
    }

    interface MatcherWithState extends Matcher {
        state: parse.ParseState;
    }

    interface Result {
        glob: string;
        state: any;
        regex: RegExp;
        posix: boolean;
        input: string;
        output: string;
        match: ReturnType<typeof test>["match"];
        isMatch: ReturnType<typeof test>["isMatch"];
    }

    interface PicomatchOptions {
        /**
         * If set, then patterns without slashes will be matched against the basename of the path if it contains slashes.
         * For example, `a?b` would match the path `/xyz/123/acb`, but not `/xyz/acb/123`.
         */
        basename?: boolean | undefined;
        /**
         * Follow bash matching rules more strictly - disallows backslashes as escape characters, and treats single stars as globstars (`**`).
         */
        bash?: boolean | undefined;
        /**
         * Return regex matches in supporting methods.
         */
        capture?: boolean | undefined;
        /**
         * Allows glob to match any part of the given string(s).
         */
        contains?: boolean | undefined;
        /**
         * Current working directory. Used by `picomatch.split()`
         */
        cwd?: string | undefined;
        /**
         * Debug regular expressions when an error is thrown.
         */
        debug?: boolean | undefined;
        /**
         * Enable dotfile matching. By default, dotfiles are ignored unless a `.` is explicitly defined in the pattern, or `options.dot` is true
         */
        dot?: boolean | undefined;
        /**
         * Custom function for expanding ranges in brace patterns, such as `{a..z}`.
         * The function receives the range values as two arguments, and it must return a string to be used in the generated regex.
         * It's recommended that returned strings be wrapped in parentheses.
         */
        expandRange?: ((a: string, b: string) => string) | undefined;
        /**
         * Throws an error if no matches are found. Based on the bash option of the same name.
         */
        failglob?: boolean | undefined;
        /**
         * To speed up processing, full parsing is skipped for a handful common glob patterns. Disable this behavior by setting this option to `false`.
         */
        fastpaths?: boolean | undefined;
        /**
         * Regex flags to use in the generated regex. If defined, the `nocase` option will be overridden.
         */
        flags?: string | undefined;
        /**
         * Custom function for formatting the returned string. This is useful for removing leading slashes, converting Windows paths to Posix paths, etc.
         */
        format?: ((str: string) => string) | undefined;
        /**
         * One or more glob patterns for excluding strings that should not be matched from the result.
         */
        ignore?: Glob | undefined;
        /**
         * Retain quotes in the generated regex, since quotes may also be used as an alternative to backslashes.
         */
        keepQuotes?: boolean | undefined;
        /**
         * When `true`, brackets in the glob pattern will be escaped so that only literal brackets will be matched.
         */
        literalBrackets?: boolean | undefined;
        /**
         * Support regex positive and negative lookbehinds. Note that you must be using Node 8.1.10 or higher to enable regex lookbehinds.
         */
        lookbehinds?: boolean | undefined;
        /**
         * Alias for `basename`
         */
        matchBase?: boolean | undefined;
        /**
         * Limit the max length of the input string. An error is thrown if the input string is longer than this value.
         */
        maxLength?: boolean | undefined;
        /**
         * Disable brace matching, so that `{a,b}` and `{1..3}` would be treated as literal characters.
         */
        nobrace?: boolean | undefined;
        /**
         * Disable brace matching, so that `{a,b}` and `{1..3}` would be treated as literal characters.
         */
        nobracket?: boolean | undefined;
        /**
         * Make matching case-insensitive. Equivalent to the regex `i` flag. Note that this option is overridden by the `flags` option.
         */
        nocase?: boolean | undefined;
        /**
         * @deprecated use `nounique` instead.
         * This option will be removed in a future major release. By default, duplicates are removed.
         * Disable uniquification by setting this option to false.
         */
        nodupes?: boolean | undefined;
        /**
         * Alias for `noextglob`
         */
        noext?: boolean | undefined;
        /**
         * Disable support for matching with extglobs (like `+(a\|b)`)
         */
        noextglob?: boolean | undefined;
        /**
         * Disable support for matching nested directories with globstars (`**`)
         */
        noglobstar?: boolean | undefined;
        /**
         * Disable support for negating with leading `!`
         */
        nonegate?: boolean | undefined;
        /**
         * Disable support for regex quantifiers (like `a{1,2}`) and treat them as brace patterns to be expanded.
         */
        noquantifiers?: boolean | undefined;
        /**
         * Function to be called on ignored items.
         */
        onIgnore?: ((result: Result) => void) | undefined;
        /**
         * Function to be called on matched items.
         */
        onMatch?: ((result: Result) => void) | undefined;
        /**
         * Function to be called on all items, regardless of whether they are matched or ignored.
         */
        onResult?: ((result: Result) => void) | undefined;
        /**
         * Support POSIX character classes ("posix brackets").
         */
        posix?: boolean | undefined;
        /**
         * Convert all slashes in file paths to forward slashes. This does not convert slashes in the glob pattern itself
         */
        posixSlashes?: boolean | undefined;
        /**
         * Convert all slashes in file paths to forward slashes. This does not convert slashes in the glob pattern itself
         */
        prepend?: boolean | undefined;
        /**
         * Use regular expression rules for `+` (instead of matching literal `+`), and for stars that follow closing parentheses or brackets (as in `)*` and `]*`).
         */
        regex?: boolean | undefined;
        /**
         * Throw an error if brackets, braces, or parens are imbalanced.
         */
        strictBrackets?: boolean | undefined;
        /**
         * When true, picomatch won't match trailing slashes with single stars.
         */
        strictSlashes?: boolean | undefined;
        /**
         * Remove backslashes preceding escaped characters in the glob pattern. By default, backslashes are retained.
         */
        unescape?: boolean | undefined;
        /**
         * Also accept backslashes as the path separator.
         */
        windows?: boolean | undefined;
    }

    function test(
        input: string,
        regex: RegExp,
        options?: PicomatchOptions,
        test?: {},
    ): { isMatch: boolean; match?: boolean | RegExpExecArray | null | undefined; output: string };

    function matchBase(input: string, glob: RegExp | string, options?: {}, posix?: any): boolean;

    function isMatch(str: string | string[], patterns: Glob, options?: {}): boolean;

    function parse(pattern: string[], options?: { maxLength?: number | undefined }): parse.ParseState[];
    function parse(pattern: string, options?: { maxLength?: number | undefined }): parse.ParseState;
    function parse(
        pattern: Glob,
        options?: { maxLength?: number | undefined },
    ): parse.ParseState | parse.ParseState[];

    const scan: typeof globalThis.scan;

    function compileRe(
        state: parse.ParseState,
        options?: PicomatchOptions,
        returnOutput?: boolean,
        returnState?: boolean,
    ): RegExp;

    function makeRe(
        input: string,
        options?: PicomatchOptions,
        returnOutput?: boolean,
        returnState?: boolean,
    ): ReturnType<typeof compileRe>;

    type ToRegexOptions = Pick<PicomatchOptions, "flags" | "nocase" | "debug">;

    function toRegex(source: string | RegExp, options?: ToRegexOptions): RegExp;

    const constants: typeof globalThis.constants;
}

export = picomatch;
