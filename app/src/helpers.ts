// could be shared between front and back
// should have a better regex or a package to do this
export const isValidUrl = (urlString: string): boolean => {
    var urlPattern = new RegExp(
        "^(https?:\\/\\/)?", // validate protocol,
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
};
