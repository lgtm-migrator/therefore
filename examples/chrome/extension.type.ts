/**
 * Generated by @zefiros-software/therefore@v0.0.1
 * Do not manually touch this
 */
/* eslint-disable */
import AjvValidator from 'ajv'
import type { ValidateFunction } from 'ajv'

interface ExtensionContentScriptsArray {
    /**
     * Specifies which pages this content script will be injected into.
     */
    matches: [MatchPattern, ...MatchPattern[]]
    /**
     * Excludes pages that this content script would otherwise be injected into.
     */
    exclude_matches: MatchPattern[]
    /**
     * The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array, before any DOM is constructed or displayed for the page.
     */
    css: Uri[]
    /**
     * The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array.
     */
    js: Scripts
    /**
     * Controls when the files in js are injected.
     *
     * @default 'document_idle'
     */
    run_at: 'document_start' | 'document_end' | 'document_idle'
    /**
     * Controls whether the content script runs in all frames of the matching page, or only the top frame.
     *
     * @default false
     */
    all_frames: boolean
    /**
     * Applied after matches to include only those URLs that also match this glob. Intended to emulate the @include Greasemonkey keyword.
     */
    include_globs: GlobPattern[]
    /**
     * Applied after matches to exclude URLs that match this glob. Intended to emulate the @exclude Greasemonkey keyword.
     */
    exclude_globs: GlobPattern[]
    /**
     * Whether to insert the content script on about:blank and about:srcdoc.
     *
     * @default false
     */
    match_about_blank: boolean
}

interface ExtensionFileBrowserHandlersArray {
    /**
     * Used by event handling code to differentiate between multiple file handlers
     */
    id: string
    /**
     * What the button will display.
     */
    default_title: string
    /**
     * Filetypes to match.
     */
    file_filters: [string, ...string[]]
}

interface ExtensionInputComponentsArray {
    name: string
    type: string
    id: string
    description: string
    language: string
    layouts: string[]
}

type ExtensionVoicesArrayEventTypesArray = 'start' | 'word' | 'sentence' | 'marker' | 'end' | 'error'

interface ExtensionVoicesArray {
    /**
     * Identifies the name of the voice and the engine used.
     */
    voice_name: string
    /**
     * Almost always, a voice can synthesize speech in just a single language. When an engine supports more than one language, it can easily register a separate voice for each language.
     */
    lang: string
    /**
     * If your voice corresponds to a male or female voice, you can use this parameter to help clients choose the most appropriate voice for their application.
     */
    gender: string
    /**
     * Events sent to update the client on the progress of speech synthesis.
     */
    event_types?: [ExtensionVoicesArrayEventTypesArray, ...ExtensionVoicesArrayEventTypesArray[]]
}

/**
 * JSON schema for Google Chrome extension manifest files
 */
export interface Extension {
    /**
     * One integer specifying the version of the manifest file format your package requires.
     */
    manifest_version: 2
    /**
     * The name of the extension
     */
    name: string
    /**
     * One to four dot-separated integers identifying the version of this extension.
     */
    version: VersionString
    /**
     * Specifies the subdirectory of _locales that contains the default strings for this extension.
     *
     * @default 'en'
     */
    default_locale: string
    /**
     * A plain text description of the extension
     */
    description: string
    /**
     * One or more icons that represent the extension, app, or theme. Recommended format: PNG; also BMP, GIF, ICO, JPEG.
     */
    icons: {
        /**
         * Used as the favicon for an extension's pages and infobar.
         */
        '16': Icon
        /**
         * Used on the extension management page (chrome://extensions).
         */
        '48': Icon
        /**
         * Used during installation and in the Chrome Web Store.
         */
        '128': Icon
        /**
         * Used during installation and in the Chrome Web Store.
         */
        '256': Icon
    }
    /**
     * Use browser actions to put icons in the main Google Chrome toolbar, to the right of the address bar. In addition to its icon, a browser action can also have a tooltip, a badge, and a popup.
     */
    browser_action: Action
    /**
     * Use the chrome.pageAction API to put icons inside the address bar. Page actions represent actions that can be taken on the current page, but that aren't applicable to all pages.
     */
    page_action: Action
    /**
     * The background page is an HTML page that runs in the extension process. It exists for the lifetime of your extension, and only one instance of it at a time is active.
     */
    background: {
        /**
         * When false, makes the background page an event page (loaded only when needed).
         *
         * @default true
         */
        persistent: boolean
        /**
         * Specify the HTML of the background page.
         *
         * @default 'background.html'
         */
        page: Uri
        /**
         * A background page will be generated by the extension system that includes each of the files listed in the scripts property.
         *
         * @default ['background.js']
         */
        scripts: Scripts
    }
    /**
     * Override pages are a way to substitute an HTML file from your extension for a page that Google Chrome normally provides.
     */
    chrome_url_overrides: {
        /**
         * The page that appears when the user chooses the Bookmark Manager menu item from the Chrome menu or, on Mac, the Bookmark Manager item from the Bookmarks menu. You can also get to this page by entering the URL chrome://bookmarks.
         *
         * @default 'bookmarks.html'
         */
        bookmarks: Page
        /**
         * The page that appears when the user chooses the History menu item from the Chrome menu or, on Mac, the Show Full History item from the History menu. You can also get to this page by entering the URL chrome://history.
         *
         * @default 'history.html'
         */
        history: Page
        /**
         * The page that appears when the user creates a new tab or window. You can also get to this page by entering the URL chrome://newtab.
         *
         * @default 'newtab.html'
         */
        newtab: Page
    }
    /**
     * Use the commands API to add keyboard shortcuts that trigger actions in your extension, for example, an action to open the browser action or send a command to the extension.
     */
    commands: {
        [k: string]: Command | undefined
    }
    /**
     * Content scripts are JavaScript files that run in the context of web pages.
     */
    content_scripts: [ExtensionContentScriptsArray, ...ExtensionContentScriptsArray[]]
    content_security_policy: ContentSecurityPolicy
    /**
     * A DevTools extension adds functionality to the Chrome DevTools. It can add new UI panels and sidebars, interact with the inspected page, get information about network requests, and more.
     */
    devtools_page: Page
    /**
     * Declares which extensions, apps, and web pages can connect to your extension via runtime.connect and runtime.sendMessage.
     */
    externally_connectable: {
        /**
         * The IDs of extensions or apps that are allowed to connect. If left empty or unspecified, no extensions or apps can connect.
         */
        ids: string[]
        /**
         * The URL patterns for web pages that are allowed to connect. This does not affect content scripts. If left empty or unspecified, no web pages can connect.
         */
        matches: string[]
        /**
         * Indicates that the extension would like to make use of the TLS channel ID of the web page connecting to it. The web page must also opt to send the TLS channel ID to the extension via setting includeTlsChannelId to true in runtime.connect's connectInfo or runtime.sendMessage's options.
         *
         * @default false
         */
        accepts_tls_channel_id: boolean
    }
    /**
     * You can use this API to enable users to upload files to your website.
     */
    file_browser_handlers: [ExtensionFileBrowserHandlersArray, ...ExtensionFileBrowserHandlersArray[]]
    /**
     * The URL of the homepage for this extension.
     */
    homepage_url: Uri
    /**
     * Specify how this extension will behave if allowed to run in incognito mode.
     *
     * @default 'spanning'
     */
    incognito: 'spanning' | 'split' | 'not_allowed'
    /**
     * Allows your extension to handle keystrokes, set the composition, and manage the candidate window.
     */
    input_components: ExtensionInputComponentsArray[]
    /**
     * This value can be used to control the unique ID of an extension, app, or theme when it is loaded during development.
     */
    key: string
    /**
     * The version of Chrome that your extension, app, or theme requires, if any.
     */
    minimum_chrome_version: VersionString
    /**
     * One or more mappings from MIME types to the Native Client module that handles each type.
     */
    nacl_modules: [
        {
            /**
             * The location of a Native Client manifest (a .nmf file) within the extension directory.
             */
            path: Uri
            /**
             * The MIME type for which the Native Client module will be registered as content handler.
             */
            mime_type: MimeType
        },
        ...{
            /**
             * The location of a Native Client manifest (a .nmf file) within the extension directory.
             */
            path: Uri
            /**
             * The MIME type for which the Native Client module will be registered as content handler.
             */
            mime_type: MimeType
        }[]
    ]
    /**
     * Use the Chrome Identity API to authenticate users: the getAuthToken for users logged into their Google Account and the launchWebAuthFlow for users logged into a non-Google account.
     */
    oauth2: {
        /**
         * You need to register your app in the Google APIs Console to get the client ID.
         */
        client_id: string
        scopes: [string, ...string[]]
    }
    /**
     * Whether the app or extension is expected to work offline. When Chrome detects that it is offline, apps with this field set to true will be highlighted on the New Tab page.
     */
    offline_enabled: boolean
    /**
     * The omnibox API allows you to register a keyword with Google Chrome's address bar, which is also known as the omnibox.
     */
    omnibox: {
        /**
         * The keyward that will trigger your extension.
         */
        keyword: string
    }
    /**
     * Use the chrome.permissions API to request declared optional permissions at run time rather than install time, so users understand why the permissions are needed and grant only those that are necessary.
     */
    optional_permissions: Permissions
    /**
     * To allow users to customize the behavior of your extension, you may wish to provide an options page. If you do, a link to it will be provided from the extensions management page at chrome://extensions. Clicking the Options link opens a new tab pointing at your options page.
     *
     * @default 'options.html'
     */
    options_page: Page
    /**
     * To allow users to customize the behavior of your extension, you may wish to provide an options page. If you do, an Options link will be shown on the extensions management page at chrome://extensions which opens a dialogue containing your options page.
     */
    options_ui: {
        /**
         * The path to your options page, relative to your extension's root.
         */
        page: string
        /**
         * If true, a Chrome user agent stylesheet will be applied to your options page. The default value is false, but we recommend you enable it for a consistent UI with Chrome.
         *
         * @default true
         */
        chrome_style?: boolean
        /**
         * If true, your extension's options page will be opened in a new tab rather than embedded in chrome://extensions. The default is false, and we recommend that you don't change it. This is only useful to delay the inevitable deprecation of the old options UI! It will be removed soon, so try not to use it. It will break.
         *
         * @default false
         */
        open_in_tab?: boolean
    }
    /**
     * Permissions help to limit damage if your extension or app is compromised by malware. Some permissions are also displayed to users before installation, as detailed in Permission Warnings.
     */
    permissions: Permissions
    /**
     * Technologies required by the app or extension. Hosting sites such as the Chrome Web Store may use this list to dissuade users from installing apps or extensions that will not work on their computer.
     */
    requirements: {
        /**
         * The '3D' requirement denotes GPU hardware acceleration.
         */
        '3D': {
            /**
             * List of the 3D-related features your app requires.
             */
            features: ['webgl', ...'webgl'[]]
        }
        /**
         * Indicates if an app or extension requires NPAPI to run. This requirement is enabled by default when the manifest includes the 'plugins' field.
         */
        plugins: {
            /**
             * @default true
             */
            npapi: boolean
        }
    }
    /**
     * Defines an collection of app or extension pages that are to be served in a sandboxed unique origin, and optionally a Content Security Policy to use with them.
     */
    sandbox: {
        pages: [Page, ...Page[]]
        /**
         * @default 'sandbox allow-scripts allow-forms'
         */
        content_security_policy: ContentSecurityPolicy
    }
    /**
     * The short name is typically used where there is insufficient space to display the full name.
     */
    short_name: string
    /**
     * If you publish using the Chrome Developer Dashboard, ignore this field. If you host your own extension or app: URL to an update manifest XML file.
     */
    update_url: Uri
    /**
     * Register itself as a speech engine.
     */
    tts_engine: {
        /**
         * Voices the extension can synthesize.
         */
        voices: [ExtensionVoicesArray, ...ExtensionVoicesArray[]]
        /**
         * In addition to the version field, which is used for update purposes, version_name can be set to a descriptive version string and will be used for display purposes if present.
         */
        version_name: string
        /**
         * An array of strings specifying the paths (relative to the package root) of packaged resources that are expected to be usable in the context of a web page.
         */
        web_accessible_resources: [Uri, ...Uri[]]
        chrome_settings_overrides: unknown
        content_pack: unknown
        current_locale: unknown
        import: unknown
        platforms: unknown
        signature: unknown
        spellcheck: unknown
        storage: unknown
        system_indicator: unknown
    }
}

export const Extension = {
    validate: require('./schemas/extension.schema.js') as ValidateFunction<Extension>,
    get schema() {
        return Extension.validate.schema
    },
    source: `${__dirname}extension.schema`,
    sourceSymbol: 'extension',
    is: (o: unknown): o is Extension => Extension.validate(o) === true,
    assert: (o: unknown) => {
        if (!Extension.validate(o)) {
            throw new AjvValidator.ValidationError(Extension.validate.errors ?? [])
        }
    },
} as const

type MatchPattern = string

type Uri = string

type Scripts = [Uri, ...Uri[]]

type GlobPattern = string

type VersionString = string

type Icon = Uri

interface Action {
    /**
     * Tooltip for the main toolbar icon.
     */
    default_title: string
    /**
     * The popup appears when the user clicks the icon.
     */
    default_popup: Uri
    default_icon:
        | string
        | {
              '19': Icon
              '38': Icon
          }
}

type Page = Uri

interface Command {
    description: string
    suggested_key: {
        [k: string]: string | undefined
    }
}

/**
 * This introduces some fairly strict policies that will make extensions more secure by default, and provides you with the ability to create and enforce rules governing the types of content that can be loaded and executed by your extensions and applications.
 *
 * @default `script-src 'self'; object-src 'self'`
 */
type ContentSecurityPolicy = string

type MimeType = string

type Permissions = string[]
