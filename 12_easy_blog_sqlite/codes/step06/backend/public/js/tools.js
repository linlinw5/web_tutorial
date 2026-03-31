// 显示分页按钮的工具
export async function renderPagination({ total, limit, offset, pagination, tag, fetchAndRenderBlogs }) {
    pagination.innerHTML = ""; // Clear previous pagination
    let totalPages = Math.ceil((total) / limit);
    let currentPage = Math.floor((offset) / limit) + 1; // Calculate current page based on offset
    console.log(`Total pages: ${totalPages}, Current page: ${currentPage}`);
    let startPage = currentPage - 2; // 确保当前页显示在中间
    if (startPage < 1) {
        startPage = 1; // 如果开始页小于1，则从1开始
    }
    let endPage = startPage + 4; // Show 5 pages in total
    if (endPage > totalPages) {
        endPage = totalPages; // 确保只显示到总页数，不要超出
        startPage = endPage - 4 > 0 ? endPage - 4 : 1; // endPag到顶部时，调整开始页
    }
    // add "Previous" button
    const prevButton = document.createElement("button");
    prevButton.textContent = "<<";
    prevButton.classList.add("prev");
    if (currentPage > 1) {
        prevButton.addEventListener("click", () => {
            fetchAndRenderBlogs(limit, offset - limit, tag);
        });
        pagination.appendChild(prevButton);
    }
    else {
        prevButton.disabled = true; // Disable if on the first page
        prevButton.classList.add("disabled");
        pagination.appendChild(prevButton);
    }
    // add numbered page buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i.toString();
        pageButton.classList.add("page");
        if (i === currentPage) {
            pageButton.classList.add("active"); // Highlight the current page
        }
        else {
            pageButton.addEventListener("click", () => {
                let newOffset = (i - 1) * limit; // Calculate new offset based on page number
                fetchAndRenderBlogs(limit, newOffset, tag);
            });
        }
        pagination.appendChild(pageButton);
    }
    // add "Next" button
    const nextButton = document.createElement("button");
    nextButton.textContent = ">>";
    nextButton.classList.add("next");
    if (currentPage < totalPages) {
        nextButton.addEventListener("click", () => {
            fetchAndRenderBlogs(limit, offset + limit, tag);
        });
        pagination.appendChild(nextButton);
    }
    else {
        nextButton.disabled = true; // Disable if on the last page
        nextButton.classList.add("disabled");
        pagination.appendChild(nextButton);
    }
}
