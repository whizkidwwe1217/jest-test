export class UriResource {
	private _url: string;
	root: boolean = false;
	api?: {
		create?: {
			url: string;
			root?: boolean;
		};
		read?: {
			url: string;
			root?: boolean;
		};
		update?: {
			url: string;
			root?: boolean;
		};
		destroy?: {
			url: string;
			root?: boolean;
		};
		list?: {
			url: string;
			root?: boolean;
		};
	} = {};

	get createUrl(): string {
		if (this.api && this.api.create && this.api.create.url) return this.api.create.url;
		return this.url;
	}

	get readUrl(): string {
		if (this.api && this.api.read && this.api.read.url) return this.api.read.url;
		return this.url;
	}

	get updateUrl(): string {
		if (this.api && this.api.update && this.api.update.url) return this.api.update.url;
		return this.url;
	}

	get destroyUrl(): string {
		if (this.api && this.api.destroy && this.api.destroy.url) return this.api.destroy.url;
		return this.url;
	}

	get listUrl(): string {
		if (this.api && this.api.list && this.api.list.url) return this.api.list.url;
		return this.url;
	}

	get url(): string {
		if (this.api && this.api.read && this.api.read.url) return this.api.read.url;
		return this._url;
	}

	set url(url: string) {
		this._url = url;
	}

	setUrl(url: string, root: boolean = false) {
		this.url = url;
		this.root = root;
		return this;
	}

	setListUrl(url: string, root: boolean = false) {
		this.api.list = { url: url, root: root };
		return this;
	}

	setReadUrl(url: string, root: boolean = false) {
		this.api.read = { url: url, root: root };
		return this;
	}

	setCreateUrl(url: string, root: boolean = false) {
		this.api.create = { url: url, root: root };
		return this;
	}

	setUpdateUrl(url: string, root: boolean = false) {
		this.api.update = { url: url, root: root };
		return this;
	}

	setDestroyUrl(url: string, root: boolean = false) {
		this.api.destroy = { url: url, root: root };
		return this;
	}
}
