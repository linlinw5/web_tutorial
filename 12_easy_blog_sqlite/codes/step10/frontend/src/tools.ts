// Pagination button rendering utility

interface renderPaginationProps {
    total: number;
    limit: number;
    offset: number;
    pagination: HTMLElement;  // The container div for pagination buttons
    tag?: string;
    fetchAndRenderBlogs: (limit: number, offset: number, tag?: string) => void | Promise<void>;
}

export async function renderPagination({ total, limit, offset, pagination, tag, fetchAndRenderBlogs }: renderPaginationProps) {
    pagination.innerHTML = ""; // Clear previous pagination

    let totalPages = Math.ceil((total) / limit);
    let currentPage = Math.floor((offset) / limit) + 1; // Calculate current page based on offset

    console.log(`Total pages: ${totalPages}, Current page: ${currentPage}`);

    let startPage = currentPage - 2; // Keep the current page centered
    if (startPage < 1) {
        startPage = 1; // If the start page is less than 1, begin from 1
    }
    let endPage = startPage + 4; // Show 5 pages in total
    if (endPage > totalPages) {
        endPage = totalPages; // Do not display beyond the total number of pages
        startPage = endPage - 4 > 0 ? endPage - 4 : 1; // When the end page reaches the top, adjust the start page
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
    } else {
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
        } else {
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
    } else {
        nextButton.disabled = true; // Disable if on the last page
        nextButton.classList.add("disabled");
        pagination.appendChild(nextButton);
    }
}