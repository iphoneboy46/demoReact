jQuery(document).ready(function($) {
    // Thiết lập PJAX cho phân trang và liên kết
    $(document).pjax('a', '#pjax-container', {
        fragment: '#pjax-container',
        timeout: 8000
    });

    // Hàm lưu trữ PJAX vào localStorage
    function cachePjax(url, content) {
        try {
            var title = $('title').text(); // Lấy tiêu đề hiện tại
            var contentWithTitle = '<title>' + title + '</title>' + content; // Gắn tiêu đề vào nội dung
            console.log('Caching URL:', url);
            localStorage.setItem('pjax_cache_' + encodeURIComponent(url), contentWithTitle);
        } catch (e) {
            console.error('Failed to cache:', e);
        }
    }

    // Hàm lấy nội dung từ cache
    function getCachedPjax(url) {
        try {
            const cached = localStorage.getItem('pjax_cache_' + encodeURIComponent(url));
             console.log(localStorage);
            console.log('Cache key:', 'pjax_cache_' + encodeURIComponent(url));
            console.log('Retrieved from cache:', cached);
            return cached;
        } catch (e) {
            console.error('Failed to retrieve from cache:', e);
            return null;
        }
    }

    // Hàm loại bỏ tham số _pjax từ URL
    function removePjaxParam(url) {
        var urlObj = new URL(url, window.location.origin);
        var params = new URLSearchParams(urlObj.search);
        params.delete('_pjax');
        urlObj.search = params.toString();
        return urlObj.toString();
    }

    // Hàm xử lý submit form và PJAX
    function handleFormSubmit() {
        $('#filter-form').on('submit', function(event) {
            event.preventDefault(); // Ngăn chặn hành động gửi mặc định của form
            var formData = $(this).serialize(); // Lấy dữ liệu từ form

            // Kiểm tra nếu URL không có param 'paged', gán mặc định là 1 ở đầu
            if (!formData.includes('paged=')) {
                formData = 'paged=1&' + formData;
            }

            var url = window.location.origin + window.location.pathname + '?' + formData; // Tạo URL với các tham số lọc
            console.log('Generated URL:', url); // In URL ra console
        
            $.pjax({
                url: url,
                container: '#pjax-container',
                fragment: '#pjax-container',
                timeout: 8000
            });
        });
    }

    // Gọi hàm khi document load lần đầu
    handleFormSubmit();

    // Xử lý khi trước khi gửi yêu cầu PJAX
    $(document).on('pjax:beforeSend', function(event, xhr, options) {
        // Loại bỏ tham số _pjax
        options.url = removePjaxParam(options.url);

        console.log('beforeSend URL:', options.url);
    
        var cachedContent = getCachedPjax(options.url);
        if (cachedContent) {
            $('#pjax-container').html(cachedContent);

            // Lấy tiêu đề từ nội dung cache nếu có
            var cachedTitle = $(cachedContent).filter('title').text();
            console.log('Cached Title:', cachedTitle); // In ra tiêu đề từ cache
            if (cachedTitle) {
                document.title = cachedTitle; // Cập nhật tiêu đề trang
            }

            window.history.replaceState(null, null, options.url);
            handleFormSubmit(); // Gắn lại sự kiện submit cho form sau khi PJAX load nội dung mới
            event.preventDefault(); // Ngăn chặn yêu cầu PJAX nếu nội dung đã có trong cache
        }
    });

    // Xử lý khi PJAX hoàn tất
    $(document).on('pjax:end', function(event, xhr, options) {
        var url = options.requestUrl;
        console.log('end URL:', url);
        var content = $('#pjax-container').html();

        // Lấy thẻ <title> từ phản hồi PJAX (xhr.responseText)
        var newTitle = $(xhr.responseText).filter('title').text();
        console.log('New Title:', newTitle); // In ra tiêu đề mới
        if (newTitle) {
            document.title = newTitle; // Cập nhật tiêu đề trang
        }

        if (content.trim()) {
            cachePjax(url, content);
        }
        
        // Loại bỏ tham số _pjax từ URL trong thanh địa chỉ
        var cleanUrl = removePjaxParam(url);
        window.history.replaceState(null, null, cleanUrl);

        handleFormSubmit(); // Gắn lại sự kiện submit cho form sau khi PJAX load nội dung mới
    });

    // Xử lý khi nhấn nút quay lại
    $(window).on('popstate', function() {
        $.pjax.reload('#pjax-container');
    });
});